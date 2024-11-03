"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Package, Upload, X, RefreshCcw, Check } from "lucide-react";
import { CategorySelector } from "../component/dash-categories-selection";
import { createProduct, uploadProductImage } from "@/actions/product";
import { useToast } from "@/hooks/use-toast";

export const ManualProductForm = () => {
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    totalAvailable: 0,
    colors: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    // Process each file
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newId = `${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const tempColor = {
          id: newId,
          name: file.name.split(".")[0], // Use filename as initial color name
          image: reader.result,
          tempImage: reader.result,
          status: "uploading",
          available: 0,
          originalFile: file,
        };

        setNewProduct((prev) => ({
          ...prev,
          colors: [...prev.colors, tempColor],
        }));

        // Upload to cloud with delay
        const formData = new FormData();
        formData.append("file", file);

        uploadProductImage(formData)
          .then((result) => {
            if (result.success) {
              // Wait 30 seconds before updating with cloud URL
              setTimeout(() => {
                setNewProduct((prev) => ({
                  ...prev,
                  colors: prev.colors.map((color) =>
                    color.id === newId
                      ? { ...color, image: result.imageUrl, status: "success" }
                      : color,
                  ),
                }));
                toast({
                  title: "Image uploaded successfully",
                  description: `${file.name} has been uploaded to the cloud`,
                  variant: "Success",
                });
              }, 10000);
            } else {
              setNewProduct((prev) => ({
                ...prev,
                colors: prev.colors.map((color) =>
                  color.id === newId ? { ...color, status: "error" } : color,
                ),
              }));
              toast({
                title: "Upload failed",
                description: `Failed to upload ${file.name}. Please try again.`,
                variant: "destructive",
              });
            }
          })
          .catch(() => {
            setNewProduct((prev) => ({
              ...prev,
              colors: prev.colors.map((color) =>
                color.id === newId ? { ...color, status: "error" } : color,
              ),
            }));
            toast({
              title: "Upload error",
              description: `Error uploading ${file.name}. Please try again.`,
              variant: "destructive",
            });
          });
      };
      reader.readAsDataURL(file);
    });
  };

  const retryUpload = async (colorIndex) => {
    const color = newProduct.colors[colorIndex];
    const formData = new FormData();
    formData.append("file", color.originalFile);

    setNewProduct((prev) => ({
      ...prev,
      colors: prev.colors.map((c, i) =>
        i === colorIndex ? { ...c, status: "uploading" } : c,
      ),
    }));

    try {
      const result = await uploadProductImage(formData);
      if (result.success) {
        setTimeout(() => {
          setNewProduct((prev) => ({
            ...prev,
            colors: prev.colors.map((c, i) =>
              i === colorIndex
                ? { ...c, image: result.imageUrl, status: "success" }
                : c,
            ),
          }));
          toast({
            title: "Retry successful",
            description: `${color.name} has been uploaded successfully`,
            variant: "Success",
          });
        }, 30000);
      } else {
        setNewProduct((prev) => ({
          ...prev,
          colors: prev.colors.map((c, i) =>
            i === colorIndex ? { ...c, status: "error" } : c,
          ),
        }));
        toast({
          title: "Retry failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      setNewProduct((prev) => ({
        ...prev,
        colors: prev.colors.map((c, i) =>
          i === colorIndex ? { ...c, status: "error" } : c,
        ),
      }));
      toast({
        title: "Retry error",
        description: "An error occurred while retrying the upload",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = async () => {
    if (
      newProduct.name &&
      newProduct.description &&
      newProduct.category &&
      newProduct.colors.length > 0 &&
      !newProduct.colors.some((color) => color.status === "error")
    ) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("category", newProduct.category.id);
      formData.append(
        "colors",
        JSON.stringify(
          newProduct.colors.map((color) => {
            const { tempImage, ...colorWithoutTempImage } = color;
            return colorWithoutTempImage;
          }),
        ),
      );
      try {
        const result = await createProduct(formData);
        if (result.success) {
          toast({
            title: "Product added successfully",
            description: "Your new product has been created",
            variant: "Success",
          });
          setNewProduct({
            name: "",
            description: "",
            category: "",
            totalAvailable: 0,
            colors: [],
          });
        } else {
          toast({
            title: "Failed to add product",
            description: result.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error adding product:", error);
        toast({
          title: "Error",
          description: "An error occurred while adding the product",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    } else {
      toast({
        title: "Validation error",
        description:
          "Please ensure all fields are filled and all images are uploaded successfully.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic product information */}
      <div>
        <Label htmlFor="productName" className="text-gray-200">
          Product Name
        </Label>
        <Input
          id="productName"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="mt-1 bg-gray-700 text-white border-gray-600"
        />
      </div>
      <div>
        <Label htmlFor="productCategory" className="text-gray-200">
          Category
        </Label>
        <div className="mt-1">
          <CategorySelector
            selectedCategory={newProduct.category}
            onSelect={(category) => setNewProduct({ ...newProduct, category })}
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="productDescription" className="text-gray-200">
          Description
        </Label>
        <Textarea
          id="productDescription"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="mt-1 bg-gray-700 text-white border-gray-600"
          rows={4}
        />
      </div>

      {/* Color variant section */}
      <div className="md:col-span-2">
        <Label className="text-gray-200">Add Colors</Label>
        <div className="flex items-center space-x-2 mt-1">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          multiple
        />
      </div>

      {/* Color variants list */}
      {newProduct.colors.length > 0 && (
        <div className="md:col-span-2">
          <Label className="text-gray-200 block mb-2">Color Variants</Label>
          {newProduct.colors.map((color, index) => (
            <div
              key={color.id}
              className="flex items-center space-x-2 bg-gray-700 p-2 rounded border border-gray-600 mb-2"
            >
              <div className="relative w-10 h-10">
                <img
                  src={color.image}
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
                      onClick={() => retryUpload(index)}
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
                  const updatedColors = [...newProduct.colors];
                  updatedColors[index].name = e.target.value;
                  setNewProduct({ ...newProduct, colors: updatedColors });
                }}
                className="flex-grow bg-gray-700 text-white border-gray-600"
              />
              <Input
                type="number"
                placeholder="Available"
                value={color.available}
                onChange={(e) => {
                  const updatedColors = [...newProduct.colors];
                  updatedColors[index].available =
                    parseInt(e.target.value) || 0;
                  setNewProduct({ ...newProduct, colors: updatedColors });
                }}
                className="w-20 bg-gray-700 text-white border-gray-600"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewProduct({
                    ...newProduct,
                    colors: newProduct.colors.filter((_, i) => i !== index),
                  });
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Submit button */}
      <div className="md:col-span-2">
        <Button
          onClick={handleAddProduct}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={
            isSubmitting ||
            newProduct.colors.some((color) => color.status === "uploading")
          }
        >
          {isSubmitting ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Package className="w-4 h-4 mr-2" />
          )}
          Add Product
        </Button>
      </div>
    </div>
  );
};
