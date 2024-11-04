import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllProducts(skip = 0, take = 14) {
  try {
    const products = await prisma.product.findMany({
      skip,
      take,
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

export async function getProductsByCategory(categoryId, skip = 0, take = 14) {
  try {
    const products = await prisma.product.findMany({
      where: { categoryId },
      skip,
      take,
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
