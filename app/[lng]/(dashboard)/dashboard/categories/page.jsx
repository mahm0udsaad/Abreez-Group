"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addCategory,
  updateCategory,
  getCategories,
  deleteCategory,
} from "@/actions/category";

export default function Component() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editParentId, setEditParentId] = useState("none");
  const [isAddingNewParent, setIsAddingNewParent] = useState(false);
  const [newParentName, setNewParentName] = useState("");
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    parentId: "none",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const result = await getCategories();
      if (result.success) {
        setCategories(result.categories);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleAddNewParent = async () => {
    if (!newParentName.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await addCategory({
        name: newParentName,
        parentId: null,
      });

      if (result.success) {
        await fetchCategories();
        setEditParentId(result.category.id);
        toast({
          title: "Success",
          description: "New parent category created successfully",
        });
        setIsAddingNewParent(false);
        setNewParentName("");
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new parent category",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  // Rest of the existing functions remain the same...
  const filteredCategories = categories.filter(
    (category) =>
      !category.parentId &&
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getAvailableParents = (currentCategory) => {
    return categories.filter((category) => {
      if (category.id === currentCategory.id) return false;
      if (category.parentId === currentCategory.id) return false;
      return !category.parentId;
    });
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditValue(category.name);
    setEditParentId(category.parentId || "none");
    setIsAddingNewParent(false);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
    setEditParentId("none");
    setIsAddingNewParent(false);
    setNewParentName("");
  };

  const handleUpdateCategory = async (category) => {
    if (!editValue.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await updateCategory(category.id, {
        name: editValue,
        parentId: editParentId === "none" ? null : editParentId,
      });

      if (result.success) {
        await fetchCategories();
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
    setEditingCategory(null);
    setEditValue("");
    setEditParentId("none");
    setIsAddingNewParent(false);
    setNewParentName("");
  };

  const handleAddCategory = async () => {
    if (!newCategoryData.name) return;

    setIsSubmitting(true);
    try {
      const result = await addCategory({
        ...newCategoryData,
        parentId:
          newCategoryData.parentId === "none" ? null : newCategoryData.parentId,
      });

      if (result.success) {
        await fetchCategories();
        setNewCategoryData({ name: "", parentId: "none" });
        toast({
          title: "Success",
          description: "Category added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteCategory = async (categoryId) => {
    setIsSubmitting(true);
    try {
      const result = await deleteCategory(categoryId);
      if (result.success) {
        await fetchCategories();
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };
  console.log(isAddingNewParent);

  const ParentSelectionContent = ({ category, onSelect, onAddNew }) => (
    <SelectContent className="bg-gray-800 text-white">
      <div className="px-2 py-2 border-b border-gray-700">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700/50"
          onClick={onAddNew}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Parent
        </Button>
      </div>
      <SelectItem value="none">No parent</SelectItem>
      {getAvailableParents(category).map((parent) => (
        <SelectItem key={parent.id} value={parent.id}>
          {parent.name}
        </SelectItem>
      ))}
    </SelectContent>
  );

  const renderCategory = (category, depth = 0) => (
    <div key={category.id} className="mb-2">
      <div
        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
          depth === 0 ? "bg-primary/10" : "bg-gray-700 hover:bg-primary/5"
        }`}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className="flex items-center gap-2 flex-1">
          {category.subcategories?.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0"
              onClick={() => toggleExpand(category.id)}
            >
              {expandedCategories[category.id] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          )}
          {editingCategory?.id === category.id ? (
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 flex gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="bg-gray-800"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateCategory(category);
                    } else if (e.key === "Escape") {
                      handleCancelEdit();
                    }
                  }}
                />
                {isAddingNewParent ? (
                  <div className="flex gap-2">
                    <Input
                      value={newParentName}
                      onChange={(e) => setNewParentName(e.target.value)}
                      placeholder="New parent name"
                      className="bg-gray-800"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddNewParent();
                        } else if (e.key === "Escape") {
                          setIsAddingNewParent(false);
                          setNewParentName("");
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleAddNewParent}
                      disabled={isSubmitting}
                      className="h-8 w-8"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsAddingNewParent(false);
                        setNewParentName("");
                      }}
                      disabled={isSubmitting}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Select
                      value={editParentId}
                      onValueChange={setEditParentId}
                    >
                      <SelectTrigger className="w-[180px] bg-gray-800">
                        <SelectValue placeholder="Select parent" />
                      </SelectTrigger>
                      <ParentSelectionContent
                        category={category}
                        onSelect={setEditParentId}
                        onAddNew={() => setIsAddingNewParent(true)}
                      />
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpdateCategory(category)}
                  disabled={isSubmitting}
                  className="h-8 w-8"
                >
                  <Check className="w-4 h-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ) : (
            <span className="font-medium">{category.name}</span>
          )}
        </div>
        {editingCategory?.id !== category.id && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditCategory(category)}
              disabled={isSubmitting}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteCategory(category.id)}
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      {expandedCategories[category.id] &&
        category.subcategories?.length > 0 && (
          <div className="mt-1">
            {category.subcategories.map((subcategory) =>
              renderCategory(subcategory, depth + 1),
            )}
          </div>
        )}
    </div>
  );

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex-1">
              <Label htmlFor="categorySearch">Search Categories</Label>
              <div className="bg-gray-800 relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="categorySearch"
                  type="text"
                  placeholder="Search categories..."
                  className="pl-10 bg-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1">
              <Label htmlFor="newCategory">New Category</Label>
              <div className="bg-gray-800 flex gap-2 mt-1">
                <Input
                  id="newCategory"
                  className="bg-gray-800"
                  placeholder="Category name"
                  value={newCategoryData.name}
                  onChange={(e) =>
                    setNewCategoryData({
                      ...newCategoryData,
                      name: e.target.value,
                    })
                  }
                  disabled={isSubmitting}
                />
                {isAddingNewParent ? (
                  <div className="flex gap-2">
                    <Input
                      value={newParentName}
                      onChange={(e) => setNewParentName(e.target.value)}
                      placeholder="New parent name"
                      className="bg-gray-800"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddNewParent();
                        } else if (e.key === "Escape") {
                          setIsAddingNewParent(false);
                          setNewParentName("");
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleAddNewParent}
                      disabled={isSubmitting}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsAddingNewParent(false);
                        setNewParentName("");
                      }}
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={newCategoryData.parentId}
                    onValueChange={(value) =>
                      setNewCategoryData({
                        ...newCategoryData,
                        parentId: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px] bg-gray-800">
                      <SelectValue placeholder="Select parent" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      <div className="px-2 py-2 border-b border-gray-700">
                        <Button
                          variant="ghost"
                          className="w-full flex items-center justify-start text-blue-400 hover:text-blue-300 hover:bg-gray-700/50"
                          onClick={() => setIsAddingNewParent(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Parent
                        </Button>
                      </div>
                      <SelectItem value="none">No parent</SelectItem>
                      {categories
                        .filter((category) => !category.parentId)
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
                <Button
                  className="flex items-center bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleAddCategory}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {filteredCategories.map((category) => renderCategory(category))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
