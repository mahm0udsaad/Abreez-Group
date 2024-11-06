"use server";
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
        colors: true,
        category: true,
      },
    });

    return { success: true, products };
  } catch (error) {
    console.error("Error getting products by category:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllProductIds() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
      },
    });

    return { success: true, products };
  } catch (error) {
    console.error("Error getting product IDs:", error);
    return { success: false, error: error.message };
  }
}

export async function searchProducts(searchTerm, skip = 0, take = 14) {
  try {
    if (!searchTerm) {
      return await getAllProducts(skip, take);
    }

    const searchQuery = searchTerm.toLowerCase();

    // Define the where clause for searching
    const whereClause = {
      OR: [
        // Search in product fields
        {
          name: {
            contains: searchQuery,
            mode: "insensitive", // Only use mode with Postgres
          },
        },
        {
          description: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          id: searchQuery, // Simplified equals comparison
        },
        // Search in categories
        {
          category: {
            OR: [
              {
                name: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                parent: {
                  name: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
              },
            ],
          },
        },
        // Search in color variants
        {
          colors: {
            some: {
              OR: [
                {
                  id: searchQuery, // Simplified equals comparison
                },
                {
                  name: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
      ],
    };

    // If not using PostgreSQL, remove the mode parameter
    if (process.env.DATABASE_PROVIDER !== "postgresql") {
      const removeMode = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            if ("mode" in obj[key]) {
              delete obj[key].mode;
            }
            removeMode(obj[key]);
          }
        }
      };
      removeMode(whereClause);
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take,
        include: {
          category: {
            include: {
              parent: true,
            },
          },
          colors: true,
          printingOptions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    return {
      success: true,
      products,
      total,
      hasMore: skip + take < total,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      success: false,
      error: error.message,
      products: [],
      total: 0,
      hasMore: false,
    };
  }
}
