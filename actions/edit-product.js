// app/actions/product.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProduct(productId, data) {
  try {
    // Update the product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        totalAvailable: data.colors.reduce(
          (acc, color) => acc + color.available,
          0,
        ),
      },
    });

    // Update color variants
    for (const color of data.colors) {
      // Check if a color with the same name already exists for this product
      const existingColor = await prisma.colorVariant.findFirst({
        where: {
          name: color.name,
          productId: productId,
        },
      });

      if (existingColor) {
        // Update the existing color's id if necessary
        await prisma.colorVariant.update({
          where: { id: existingColor.id },
          data: {
            id: color.id, // Update the id
            name: color.name,
            available: color.available,
            image: color.image,
          },
        });
      } else {
        // Create a new color variant
        await prisma.colorVariant.create({
          data: {
            id: color.id,
            name: color.name,
            available: color.available,
            image: color.image,
            productId: productId,
          },
        });
      }
    }

    // Revalidate paths to refresh cached data
    revalidatePath("/products");
    return { success: true, product };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update product" };
  } finally {
    revalidatePath("/dashboard");
  }
}

export async function sellProduct(productId, colorId, quantity) {
  try {
    // Get the color variant
    const colorVariant = await prisma.colorVariant.findUnique({
      where: { id: colorId },
    });

    if (!colorVariant || colorVariant.available < quantity) {
      return { success: false, error: "Insufficient stock" };
    }

    // Update the color variant
    await prisma.colorVariant.update({
      where: { id: colorId },
      data: {
        available: colorVariant.available - quantity,
      },
    });

    // Update the product total
    await prisma.product.update({
      where: { id: productId },
      data: {
        totalAvailable: {
          decrement: quantity,
        },
      },
    });

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to process sale" };
  } finally {
    revalidatePath("/dashboard");
  }
}

export async function addColorVariant(productId, data) {
  console.log("Adding color variant:", data);

  try {
    const newId = `${productId.substring(0, 2).toUpperCase()}${data.name
      .substring(0, 1)
      .toUpperCase()}${Date.now().toString().slice(-3)}`;

    const colorVariant = await prisma.colorVariant.create({
      data: {
        id: newId,
        name: data.name,
        image: data.image,
        available: data.available,
        productId: productId,
      },
    });

    revalidatePath("/products");
    return { success: true, colorVariant };
  } catch (error) {
    return { success: false, error: "Failed to add color variant" };
  } finally {
    revalidatePath("/dashboard");
  }
}
export async function deleteColorVariant(productId, colorId) {
  console.log("Deleting color variant:", productId, colorId);

  try {
    const colorToDelete = await prisma.colorVariant.findUnique({
      where: { id: colorId },
    });

    if (!colorToDelete) {
      return {
        success: false,
        error: "Color variant not found",
      };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    await prisma.colorVariant.delete({
      where: { id: colorId },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to delete color variant",
    };
  } finally {
    revalidatePath("/dashboard");
  }
}
