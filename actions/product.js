"use server";

import { PrismaClient } from "@prisma/client";
import { uploadToCloud } from "@/lib/cloud";

const prisma = new PrismaClient();

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
