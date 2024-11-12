"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader,
  Package,
  Upload,
  X,
  RefreshCcw,
  Check,
  Plus,
} from "lucide-react";
import { CategorySelector } from "../component/dash-categories-selection";
import { createProduct, uploadProductImage } from "@/actions/product";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/app/i18n/client";

export function ManualProductForm({ lng }) {
  const { t } = useTranslation(lng, "dashboard");
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    totalAvailable: 0,
    colors: [],
    materials: "",
    itemSize: "",
    itemWeight: "",
    printingOptions: [],
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
                  title: t("imageUploadSuccess"),
                  description: `${file.name} ${t("uploadedToCloud")}`,
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
                title: t("uploadFailed"),
                description: `${t("failedUploadMessage")} ${file.name}. ${t(
                  "pleaseTryAgain",
                )}`,
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
              title: t("uploadError"),
              description: `${t("errorUploadingMessage")} ${file.name}. ${t(
                "pleaseTryAgain",
              )}`,
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
            title: t("retrySuccessful"),
            description: `${color.name} ${t("uploadedSuccessfully")}`,
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
          title: t("retryFailed"),
          description: t("retryErrorMessage"),
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
        title: t("retryError"),
        description: t("retryUploadError"),
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
      formData.append("materials", newProduct.materials);
      formData.append("itemSize", newProduct.itemSize);
      formData.append("itemWeight", newProduct.itemWeight);
      formData.append(
        "printingOptions",
        JSON.stringify(newProduct.printingOptions),
      );

      try {
        const result = await createProduct(formData);
        if (result.success) {
          toast({
            title: t("productAddedSuccessfully"),
            description: t("newProductCreated"),
            variant: "Success",
          });
          setNewProduct({
            name: "",
            description: "",
            category: "",
            totalAvailable: 0,
            colors: [],
            materials: "",
            itemSize: "",
            itemWeight: "",
            printingOptions: [],
          });
        } else {
          toast({
            title: t("failedToAddProduct"),
            description: result.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error adding product:", error);
        toast({
          title: t("error"),
          description: t("errorAddingProduct"),
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    } else {
      toast({
        title: t("validationError"),
        description: t("validationErrorMessage"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic product information */}
        <div>
          <Label htmlFor="productName" className="text-gray-200">
            {t("productName")}
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
            {t("category")}
          </Label>
          <div className="mt-1">
            <CategorySelector
              selectedCategory={newProduct.category}
              onSelect={(category) =>
                setNewProduct({ ...newProduct, category })
              }
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="productDescription" className="text-gray-200">
            {t("description")}
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
      </div>

      {/* Additional product information */}
      <div className="flex w-full gap-2">
        <div className="flex-1">
          <Label htmlFor="productMaterials" className="text-gray-200">
            {t("materials")}
          </Label>
          <Input
            id="productMaterials"
            value={newProduct.materials}
            onChange={(e) =>
              setNewProduct({ ...newProduct, materials: e.target.value })
            }
            className="mt-1 w-full bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="productSize" className="text-gray-200">
            {t("itemSize")}
          </Label>
          <Input
            id="productSize"
            value={newProduct.itemSize}
            onChange={(e) =>
              setNewProduct({ ...newProduct, itemSize: e.target.value })
            }
            className="mt-1 w-full bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="productWeight" className="text-gray-200">
            {t("itemWeight")}
          </Label>
          <Input
            id="productWeight"
            value={newProduct.itemWeight}
            onChange={(e) =>
              setNewProduct({ ...newProduct, itemWeight: e.target.value })
            }
            className="mt-1 w-full bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="printingOptions" className="text-gray-200">
          {t("printingOptions")}
        </Label>
        <div className="flex flex-col space-y-2 mt-1">
          {newProduct.printingOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...newProduct.printingOptions];
                  updatedOptions[index] = e.target.value;
                  setNewProduct({
                    ...newProduct,
                    printingOptions: updatedOptions,
                  });
                }}
                className="bg-gray-700 text-white border-gray-600 flex-grow"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const updatedOptions = [...newProduct.printingOptions];
                  updatedOptions.splice(index, 1);
                  setNewProduct({
                    ...newProduct,
                    printingOptions: updatedOptions,
                  });
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              setNewProduct({
                ...newProduct,
                printingOptions: [...newProduct.printingOptions, ""],
              })
            }
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addPrintingOption")}
          </Button>
        </div>
      </div>

      {/* Color variant section */}
      <div className="md:col-span-2">
        <Label className="text-gray-200">{t("add_color")}</Label>
        <div className="flex items-center space-x-2 mt-1">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <Upload className="h-4 w-4 mr-2" />
            {t("uploadProductImage")}
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
          <Label className="text-gray-200 block mb-2">{t("colors")}</Label>
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
          {t("addProduct")}
        </Button>
      </div>
    </div>
  );
}
