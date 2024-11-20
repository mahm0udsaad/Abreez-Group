"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/actions/services";
import { uploadToCloud } from "@/lib/cloud";

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const result = await getServices();
    if (result.success) {
      setServices(result.data);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a FormData object for upload
      const formData = new FormData();
      formData.append("file", file);

      // Generate a temporary local URL for immediate preview
      const tempUrl = URL.createObjectURL(file);

      // Create a temporary image object with loading state
      const tempImage = {
        id: `temp-${Date.now()}`,
        url: tempUrl,
        state: "uploading",
        createdAt: new Date(),
      };

      // Set the temporary image for immediate display with loading indicator
      setImageUrl(tempImage);
      setIsUploading(true);

      try {
        // Simulate a 30-second delay to mimic processing
        const result = await uploadToCloud(formData);

        setTimeout(() => {
          setImageUrl({ state: "success", url: result.adImage });
        }, 3000);

        // Show success toast
        if (imageUrl.state === "success") {
          toast({
            title: "Upload Successful",
            description: "Image uploaded and processed",
            variant: "default",
          });
        }
      } catch (error) {
        // Handle upload failure
        setImageUrl(null);

        toast({
          title: "Upload Failed",
          description: error.message || "Failed to upload image",
          variant: "destructive",
        });
      } finally {
        // Always set uploading to false
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !imageUrl) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const serviceData = {
      title,
      category,
      image: imageUrl.url,
    };

    try {
      if (selectedService) {
        const result = await updateService(selectedService.id, serviceData);
        if (result.success) {
          toast({
            title: "Success",
            description: "Service updated successfully",
          });
        }
      } else {
        const result = await createService(serviceData);
        if (result.success) {
          toast({
            title: "Success",
            description: "Service created successfully",
          });
        }
      }

      setIsDialogOpen(false);
      resetForm();
      loadServices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const result = await deleteService(id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
        loadServices();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete service",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setImageUrl("");
    setSelectedService(null);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setTitle(service.title);
    setCategory(service.category);
    setImageUrl(service.image);
    setIsDialogOpen(true);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mt-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400">Service Manager</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle>
                  {selectedService ? "Edit Service" : "Add New Service"}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Fill in the service details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-200">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                    placeholder="Enter service title"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-gray-200">
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                      <SelectItem value="PRINTING">Printing</SelectItem>
                      <SelectItem value="MANUFACTURING">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="PACKAGING">Packaging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-200">Image</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative
    ${
      isDraggingFile
        ? "border-blue-500 bg-blue-500/10"
        : "border-gray-600 hover:border-gray-500"
    }`}
                    onClick={() =>
                      document.getElementById("service-image").click()
                    }
                  >
                    {imageUrl ? (
                      <div className="relative">
                        <Image
                          src={imageUrl.url}
                          alt="Service preview"
                          width={200}
                          height={200}
                          className={`mx-auto rounded ${
                            imageUrl.state === "uploading" ? "opacity-50" : ""
                          }`}
                        />
                        {imageUrl.state === "uploading" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 text-red-400 hover:text-red-300 hover:bg-red-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageUrl("");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-400">
                          Click to upload image
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      id="service-image"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                      disabled={isUploading}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={isUploading}
                  >
                    {imageUrl.state === "uploading" ? "Uploading..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center bg-gray-700 p-4 rounded"
            >
              <Image
                src={service.image}
                alt={service.title}
                width={80}
                height={80}
                className="rounded object-cover mx-4"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-200">
                  {service.title}
                </h3>
                <span className="text-sm text-gray-400">
                  {service.category.toLowerCase()}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(service)}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-900"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceManager;
