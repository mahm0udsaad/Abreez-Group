// EditProductCard.js
import React, { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Circle,
  Check,
  Loader,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  updateProduct,
  addColorVariant,
  deleteColorVariant,
} from "@/actions/edit-product";
import { uploadToCloud } from "@/lib/cloud";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function EditProductCard({ product, onCancel, onSave }) {
  const [editedProduct, setEditedProduct] = useState(product);
  const [currentColor, setCurrentColor] = useState(product.colors[0]);
  const [pendingColors, setPendingColors] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  // Modify the existing CardContent JSX to include the new color upload UI
  const renderColorUploadSection = () => {
    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            multiple
          />
        </div>

        {pendingColors.length > 0 && (
          <div className="space-y-2">
            {pendingColors.map((color) => (
              <div
                key={color.id}
                className="flex items-center space-x-2 bg-gray-700 p-2 rounded border border-gray-600"
              >
                <div className="relative w-24 h-10">
                  <img
                    src={color.tempImage}
                    alt={color.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {color.status === "uploading" && (
                      <div className="bg-black bg-opacity-50 absolute inset-0 flex items-center justify-center rounded">
                        <Loader className="h-4 w-4 animate-spin text-white" />
                      </div>
                    )}
                    {color.status === "error" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => retryUpload(color.id)}
                        className="bg-black bg-opacity-50 absolute inset-0 flex items-center justify-center rounded hover:bg-opacity-60"
                      >
                        <RefreshCcw className="h-4 w-4 text-white" />
                      </Button>
                    )}
                    {color.status === "success" && (
                      <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <Input
                  placeholder="Color name"
                  value={color.name}
                  onChange={(e) => {
                    setPendingColors((prev) =>
                      prev.map((c) =>
                        c.id === color.id ? { ...c, name: e.target.value } : c,
                      ),
                    );
                  }}
                  className="flex-grow bg-gray-700 text-white border-gray-600"
                />
                <Input
                  type="number"
                  placeholder="Available"
                  value={color.available}
                  onChange={(e) => {
                    setPendingColors((prev) =>
                      prev.map((c) =>
                        c.id === color.id
                          ? { ...c, available: parseInt(e.target.value) || 1 }
                          : c,
                      ),
                    );
                  }}
                  className="w-14 bg-gray-700 text-white border-gray-600"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPendingColors((prev) =>
                      prev.filter((c) => c.id !== color.id),
                    );
                  }}
                  className="text-blue-400 hover:text-blue-300 p-0.5"
                >
                  <X className="size-2" />
                </Button>
              </div>
            ))}

            <Button
              onClick={handleSaveNewColors}
              className="w-full bg-green-600 text-white hover:bg-green-700"
              disabled={
                isPending || !pendingColors.some((c) => c.status === "success")
              }
            >
              Save New Colors
            </Button>
          </div>
        )}
      </div>
    );
  };
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newId = `${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const tempColor = {
          id: newId,
          name: file.name.split(".")[0],
          image: reader.result,
          tempImage: reader.result,
          status: "uploading",
          available: 0,
          originalFile: file,
        };

        setPendingColors((prev) => [...prev, tempColor]);

        const formData = new FormData();
        formData.append("file", file);

        uploadToCloud(formData)
          .then((result) => {
            if (result?.adImage) {
              setPendingColors((prev) =>
                prev.map((color) =>
                  color.id === newId
                    ? { ...color, image: result.adImage, status: "success" }
                    : color,
                ),
              );

              toast({
                title: "Success",
                description: `${file.name} has been uploaded`,
                variant: "Success",
              });
            } else {
              setPendingColors((prev) =>
                prev.map((color) =>
                  color.id === newId ? { ...color, status: "error" } : color,
                ),
              );

              toast({
                title: "Error",
                description: `Failed to upload ${file.name}`,
                variant: "destructive",
              });
            }
          })
          .catch((error) => {
            setPendingColors((prev) =>
              prev.map((color) =>
                color.id === newId ? { ...color, status: "error" } : color,
              ),
            );

            toast({
              title: "Error",
              description: "Failed to upload image",
              variant: "destructive",
            });
          });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveNewColors = async () => {
    const validColors = pendingColors.filter(
      (color) =>
        color.status === "success" && color.name.trim() && color.available > 0,
    );

    if (validColors.length === 0) {
      toast({
        title: "Error",
        description:
          "No valid colors to save. Ensure colors have names and quantities greater than 0.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const promises = validColors.map((color) =>
          addColorVariant(product.id, {
            name: color.name,
            image: color.image,
            available: color.available,
          }),
        );

        const results = await Promise.all(promises);
        const allSuccessful = results.every((r) => r.success);

        if (allSuccessful) {
          const newColors = results.map((r) => r.colorVariant);
          const updatedProduct = {
            ...editedProduct,
            colors: [...editedProduct.colors, ...newColors],
          };

          setEditedProduct(updatedProduct);
          setPendingColors([]);

          toast({
            title: "Success",
            description: "New colors added successfully",
            variant: "Success",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to save some colors",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save colors",
          variant: "destructive",
        });
      }
    });
  };

  const handleDeleteColor = async () => {
    if (!colorToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteColorVariant(product.id, colorToDelete.id);

        if (result.success) {
          const updatedColors = editedProduct.colors.filter(
            (c) => c.id !== colorToDelete.id,
          );
          setEditedProduct({
            ...editedProduct,
            colors: updatedColors,
          });

          if (currentColor.id === colorToDelete.id) {
            setCurrentColor(updatedColors[0] || null);
          }

          toast({
            title: "Success",
            description: "Color variant deleted successfully",
            variant: "Success",
          });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete color variant",
          variant: "destructive",
        });
      } finally {
        setColorToDelete(null);
        setDeleteDialogOpen(false);
      }
    });
  };

  const handleSave = async () => {
    // Validate that all colors have available > 0
    const invalidColors = editedProduct.colors.filter((c) => c.available <= 0);
    if (invalidColors.length > 0) {
      toast({
        title: "Validation Error",
        description: "All colors must have available quantity greater than 0",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await updateProduct(product.id, {
        name: editedProduct.name,
        description: editedProduct.description,
        colors: editedProduct.colors.map(
          ({ status, tempImage, originalFile, ...color }) => color,
        ),
      });

      if (result.success) {
        onSave(editedProduct);
        toast({
          title: "Success",
          description: "Product updated successfully",
          variant: "Success",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300 bg-gray-800 border-gray-700">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentColor?.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={currentColor?.image}
              alt={`${editedProduct.name} in ${currentColor?.name}`}
              width={400}
              height={300}
              className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>
        <Badge
          variant={
            editedProduct.totalAvailable > 0 ? "secondary" : "destructive"
          }
          className="absolute top-2 right-2 bg-green-600 text-white"
        >
          {editedProduct.totalAvailable > 0
            ? `Available ${editedProduct.colors.reduce(
                (acc, c) => acc + c.available,
                0,
              )}`
            : "Out of stock"}
        </Badge>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 left-2 bg-blue-500 text-white hover:bg-blue-600"
          onClick={onCancel}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-2 right-2 bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => fileInputRef.current.click()}
          disabled={isPending}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          multiple
        />
      </div>
      <CardContent className="p-4 flex-grow text-gray-200">
        <Input
          value={editedProduct.name}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, name: e.target.value })
          }
          className="text-xl font-semibold mb-2 bg-gray-700 text-white border-gray-600"
          disabled={isPending}
        />
        <Textarea
          value={editedProduct.description}
          onChange={(e) =>
            setEditedProduct({
              ...editedProduct,
              description: e.target.value,
            })
          }
          className="text-sm text-gray-300 mb-2 bg-gray-700 border-gray-600"
          disabled={isPending}
        />

        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-200">Existing Colors:</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {editedProduct.colors.map((color) => (
            <div
              key={color.id}
              className="flex flex-col space-y-2 bg-gray-700 p-2 rounded-lg border border-gray-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Circle
                    className="h-4 w-4"
                    fill={color.name}
                    color={color.name}
                  />
                  <Input
                    value={color.name}
                    onChange={(e) => {
                      const updatedColors = editedProduct.colors.map((c) =>
                        c.id === color.id ? { ...c, name: e.target.value } : c,
                      );
                      setEditedProduct({
                        ...editedProduct,
                        colors: updatedColors,
                      });
                    }}
                    className="w-24 h-8 text-sm bg-gray-600 border-gray-500"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => {
                    setColorToDelete(color);
                    setDeleteDialogOpen(true);
                  }}
                  disabled={editedProduct.colors.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <AlertDialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this color variant? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setDeleteDialogOpen(false)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteColor}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Input
                type="number"
                value={color.available}
                onChange={(e) => {
                  const updatedColors = editedProduct.colors.map((c) =>
                    c.id === color.id
                      ? { ...c, available: parseInt(e.target.value) || 1 }
                      : c,
                  );
                  setEditedProduct({ ...editedProduct, colors: updatedColors });
                }}
                min="1"
                className="w-full h-8 text-sm bg-gray-600 border-gray-500"
                placeholder="Available quantity"
              />
            </div>
          ))}
        </div>

        {renderColorUploadSection()}

        <div className="mt-4">
          <Badge
            key={editedProduct.category.id}
            variant="outline"
            className="mt-2 mr-2 bg-gray-700 text-blue-400 hover:bg-gray-600 transition-colors duration-300 border-gray-600"
          >
            {editedProduct.category.name}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
          onClick={handleSave}
          disabled={isPending}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}