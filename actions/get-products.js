"use server";

import prisma from "@/lib/prisma";

export async function getAllProducts(skip = 0, take = 14) {
  try {
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        skip,
        take,
        include: {
          printingOptions: true,
          category: true,
          colors: true,
        },
      }),
      prisma.product.count(),
    ]);

    return {
      success: true,
      products: products || [],
      hasMore: skip + take < total,
    };
  } catch (error) {
    console.error("Error getting all products:", error);
    return {
      success: false,
      error: error.message,
      products: [],
      hasMore: false,
    };
  }
}

export async function getProductsByCategory(categoryId, skip = 0, take = 14) {
  try {
    let whereClause = {};

    // Check if we need to include all subcategories
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { subcategories: true },
    });

    if (category && !category.parentId) {
      // It's a parent category - include all subcategories
      const subcategoryIds = category.subcategories.map((sub) => sub.id);
      whereClause = {
        OR: [{ categoryId }, { categoryId: { in: subcategoryIds } }],
      };
    } else {
      // It's a subcategory - just use the specific categoryId
      whereClause = { categoryId };
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take,
        include: {
          colors: true,
          category: true,
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    return {
      success: true,
      products,
      hasMore: skip + take < total,
    };
  } catch (error) {
    console.error("Error getting products by category:", error);
    return {
      success: false,
      error: error.message,
      products: [],
      hasMore: false,
    };
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
    // Trim whitespace and convert to lowercase
    const originalSearchTerm = searchTerm;
    const searchQuery = searchTerm.trim().toLowerCase();

    // If the search query is empty after trimming
    if (!searchQuery) {
      return await getAllProducts(skip, take);
    }

    const whereClause = {
      OR: [
        // Search in product fields
        {
          name: {
            contains: searchQuery,
          },
        },
        {
          description: {
            contains: searchQuery,
          },
        },
        // Exact match for product ID
        {
          id: searchQuery,
        },
        // Search in categories
        {
          category: {
            OR: [
              {
                name: {
                  contains: searchQuery,
                },
              },
              {
                parent: {
                  name: {
                    contains: searchQuery,
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
                // Exact match for color ID
                {
                  id: originalSearchTerm,
                },
              ],
            },
          },
        },
      ],
    };

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
