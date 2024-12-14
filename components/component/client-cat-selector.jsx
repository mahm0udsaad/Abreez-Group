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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { getCategories } from "@/actions/category";
import { cn } from "@/lib/utils";

export function CategorySelector({
  onSelect,
  selectedCategory,
  disabled = false,
  placeholder = "Select category...",
  t,
}) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    if (isLoading) return;

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
          title: "Error fetching categories",
          description: result.error || "Failed to fetch categories",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSelect = (category) => {
    if (onSelect && !disabled) {
      onSelect(category);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={false}
          className={cn(
            "w-[200px] justify-between border-2 border-white/30 bg-white/20 backdrop-blur-lg hover:bg-white/30",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <span className="truncate">
            {selectedCategory?.name || placeholder}
          </span>
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[200px] glass-scrollbar h-auto overflow-y-auto border-2 border-white/30 bg-white/20 backdrop-blur-lg font-semibold max-h-[28rem]"
        align="start"
      >
        <DropdownMenuGroup>
          {categories.length === 0 && !isLoading && (
            <DropdownMenuItem disabled className="opacity-50">
              No categories available
            </DropdownMenuItem>
          )}
          {categories.map((category) => (
            <DropdownMenuSub key={category.id}>
              <DropdownMenuSubTrigger className="flex items-center hover:bg-white/30">
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCategory?.id === category.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                <span className="truncate">{category.name}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  className="glass-scrollbar border-2 border-white/30 bg-white/20 backdrop-blur-lg font-semibold"
                  sideOffset={2}
                  alignOffset={-5}
                >
                  {(!category.subcategories ||
                    category.subcategories.length === 0) && (
                    <DropdownMenuItem disabled className="opacity-50">
                      No subcategories available
                    </DropdownMenuItem>
                  )}
                  {category.subcategories?.map((subCategory) => (
                    <DropdownMenuItem
                      key={subCategory.id}
                      onClick={() => handleSelect(subCategory)}
                      className="flex items-center hover:bg-white/30"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCategory?.id === subCategory.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="truncate">{subCategory.name}</span>
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

export default CategorySelector;
