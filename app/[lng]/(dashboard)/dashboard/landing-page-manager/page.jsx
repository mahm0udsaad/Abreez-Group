"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, GripVertical, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  getHeroImages,
  uploadHeroImage,
  updateHeroImageOrder,
  deleteHeroImage,
} from "@/actions/landing";
import ServiceManager from "@/components/dashboard/service-manager";
import SocialLinksEditor from "@/components/dashboard/footer-links-manager";

const HeroSectionManager = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const result = await getHeroImages();
    if (result.success) {
      setHeroImages(result.images);
    }
  };

  const processFiles = (files) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newId = `${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const tempImage = {
          id: newId,
          url: reader.result,
          status: "uploading",
          createdAt: new Date(),
        };

        setHeroImages((prev) => [...prev, tempImage]);

        const formData = new FormData();
        formData.append("file", file);

        uploadHeroImage(formData)
          .then((result) => {
            if (result.success) {
              setTimeout(() => {
                setHeroImages((prev) =>
                  prev.map((img) =>
                    img.id === newId
                      ? {
                          ...img,
                          id: result.id,
                          url: result.imageUrl,
                          status: "success",
                        }
                      : img,
                  ),
                );
                toast({
                  title: "Success",
                  description: `Image uploaded successfully`,
                  variant: "default",
                });
              }, 10000);
            } else {
              setHeroImages((prev) =>
                prev.map((img) =>
                  img.id === newId ? { ...img, status: "error" } : img,
                ),
              );
              toast({
                title: "Upload Failed",
                description: "Failed to upload image. Please try again.",
                variant: "destructive",
              });
            }
          })
          .catch(() => {
            setHeroImages((prev) =>
              prev.map((img) =>
                img.id === newId ? { ...img, status: "error" } : img,
              ),
            );
            toast({
              title: "Error",
              description: "Error uploading image. Please try again.",
              variant: "destructive",
            });
          });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  // Image reordering drag handlers
  const handleImageDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
  };

  const handleImageDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleImageDrop = async (e, index) => {
    e.preventDefault();

    const items = Array.from(heroImages);
    const draggedImage = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedImage);

    setHeroImages(items);
    setDraggedItem(null);

    // Update order in database
    const result = await updateHeroImageOrder(items);
    if (!result.success) {
      toast({
        title: "Error",
        description: "Failed to update image order. Please try again.",
        variant: "destructive",
      });
      // Reload original order
      loadImages();
    }
  };
  const handleRemoveImage = async (id) => {
    const result = await deleteHeroImage(id);
    if (result.success) {
      loadImages();
    }
  };
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        Hero Section Manager
      </h1>
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="mb-6">
            <Label htmlFor="image-upload" className="text-gray-200 mb-2 block">
              Add New Hero Image
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${
                  isDraggingFile
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById("image-upload").click()}
            >
              <input
                type="file"
                id="image-upload"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
                multiple
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-400">
                {isDraggingFile
                  ? "Drop to upload!"
                  : "Click to upload or drag and drop"}
              </p>
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto border border-gray-700 rounded-md p-2">
            {heroImages.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragEnd={handleImageDragEnd}
                onDragOver={handleImageDragOver}
                onDrop={(e) => handleImageDrop(e, index)}
                className={`flex items-center bg-gray-700 p-2 mb-2 rounded transition-colors cursor-move
                  ${image.status === "uploading" ? "opacity-50" : ""}
                  ${image.status === "error" ? "border-red-500" : ""}
                  ${draggedItem === index ? "opacity-50" : ""}
                  ${
                    draggedItem !== null && draggedItem !== index
                      ? "border-t-2 border-blue-500"
                      : ""
                  }
                `}
              >
                <div className="mr-2 text-gray-400">
                  <GripVertical />
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full mr-2">
                  {index + 1}
                </div>
                <div className="flex-grow flex items-center gap-4">
                  <Image
                    src={image.url}
                    alt={`Hero image ${index + 1}`}
                    width={100}
                    height={50}
                    className="object-cover rounded mr-2"
                  />
                  <span className="text-gray-400 text-sm">
                    Created: {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {image.status === "error" && (
                  <span className="text-red-400 mr-2">Upload failed</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveImage(image.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-gray-300">
              Drag and drop to reorder images. The number indicates the order in
              which images will appear.
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <ServiceManager />
        <SocialLinksEditor />
      </div>
    </div>
  );
};

export default HeroSectionManager;
