"use server";

import { uploadToCloud } from "@/lib/cloud";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function generateProductId(categoryId) {
  console.log(categoryId);

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { name: true },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Get first 3 characters of category name, convert to uppercase
    const prefix = category.name.substring(0, 3).toUpperCase();

    // Generate 5 random numbers
    const numbers = Math.floor(10000 + Math.random() * 90000);

    const productId = `${prefix}${numbers}`;

    // Check if this ID already exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (existingProduct) {
      // If ID exists, try again recursively
      return generateProductId(categoryId);
    }

    return productId;
  } catch (error) {
    console.error("Error generating product ID:", error);
    throw error;
  }
}

export async function createProduct(formData) {
  try {
    const name = formData.get("name");
    const description = formData.get("description");
    const categoryId = formData.get("category");
    const colorsData = JSON.parse(formData.get("colors"));
    const materials = formData.get("materials") || "";
    const itemSize = formData.get("itemSize") || "";
    const itemWeight = formData.get("itemWeight") || "";
    const printingOptionsData =
      JSON.parse(formData.get("printingOptions")) || [];

    if (!categoryId) throw new Error("Category is required");

    const productId = await generateProductId(categoryId);

    // Use a transaction to ensure all operations succeed or fail together
    const product = await prisma.$transaction(async (prisma) => {
      // Create the product first
      const newProduct = await prisma.product.create({
        data: {
          id: productId,
          name,
          description,
          totalAvailable: colorsData.reduce(
            (sum, color) => sum + color.available,
            0,
          ),
          categoryId,
          multiImages: colorsData.length > 1,
          materials,
          itemSize,
          itemWeight,
          printingOptions: {
            createMany: {
              data: printingOptionsData.map((option) => ({
                name: option,
              })),
            },
          },
        },
      });

      // Create all color variants
      for (let i = 0; i < colorsData.length; i++) {
        const color = colorsData[i];
        const colorId = `${productId}C${(i + 1).toString().padStart(2, "0")}`;

        await prisma.colorVariant.create({
          data: {
            id: colorId,
            name: color.name,
            available: color.available,
            image: color.image,
            productId: newProduct.id,
          },
        });
      }

      return newProduct;
    });

    return { success: true, productId: product.id };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  } finally {
    revalidatePath("/dashboard");
  }
}

export async function uploadProductImage(formData) {
  try {
    const file = formData.get("file");
    if (!file) {
      throw new Error("No file provided");
    }

    const result = await uploadToCloud(formData);
    if (!result?.adImage) {
      throw new Error("Failed to upload image");
    }

    return { success: true, imageUrl: result.adImage };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        printingOptions: true,
        category: true,
        colors: true,
      },
    });
    return { success: true, products: products || [] };
  } catch (error) {
    console.error("Error getting all products:", error);
    return { success: false, error: error.message };
  }
}

export async function getProductsByCategory(categoryId) {
  try {
    const products = await prisma.product.findMany({
      where: { categoryId },
      include: {
        colorVariants: true,
        category: true,
      },
    });

    return { success: true, products };
  } catch (error) {
    console.error("Error getting products by category:", error);
    return { success: false, error: error.message };
  }
}

export async function getProductById(productId) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        printingOptions: true,
        colors: true,
        category: {
          include: {
            parent: true,
          },
        },
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, product };
  } catch (error) {
    console.error("Error getting product by id:", error);
    return { success: false, error: error.message };
  }
}
export async function deleteProductById(productId) {
  try {
    // Use a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (prisma) => {
      // 1. Delete all PrintingOptions associated with the Product
      await prisma.printingOption.deleteMany({
        where: {
          productId: productId,
        },
      });
      console.log("PrintingOptions deleted");

      // 2. Delete all ColorVariants associated with the Product
      await prisma.colorVariant.deleteMany({
        where: {
          productId: productId,
        },
      });
      console.log("Colors deleted");

      // 3. Delete the Product
      await prisma.product.delete({
        where: {
          id: productId,
        },
      });
    });
    console.log("Product deleted");

    return { success: true };
  } catch (error) {
    console.error("Error deleting product by id:", error);
    return { success: false, error: error.message };
  } finally {
    revalidatePath("/dashboard");
  }
}
