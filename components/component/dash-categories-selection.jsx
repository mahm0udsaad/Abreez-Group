import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCategories } from "@/actions/category";

export function CategorySelector({ onSelect, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const result = await getCategories();
        if (result.success) {
          const parentCategories = result.categories.filter(
            (category) => !category.parentId,
          );
          setCategories(parentCategories);
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

    fetchCategories();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start bg-gray-700 text-white hover:text-black border-gray-600 hover:bg-gray-600"
        >
          {selectedCategory.name || "Select a category"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-700 border-gray-600">
        <DropdownMenuGroup>
          {categories.map((category) => (
            <DropdownMenuSub key={category.id}>
              <DropdownMenuSubTrigger className="text-white hover:text-black hover:bg-gray-600">
                <span>{category.name}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-gray-700 border-gray-600">
                  {category.subcategories?.map((subCategory) => (
                    <DropdownMenuItem
                      key={subCategory.id}
                      className="text-white hover:bg-gray-600 cursor-pointer"
                      onClick={() => onSelect(subCategory)}
                    >
                      {subCategory.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
