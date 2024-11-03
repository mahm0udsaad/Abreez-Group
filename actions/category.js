"use server";

import { PrismaClient } from "@prisma/client";
import { slugify } from "@/lib/utils";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function seedCategories() {
  try {
    console.log("Starting category seeding...");

    const categories = [
      {
        name: "Notebooks & Notebads",
        subCategories: ["Notebooks"],
      },
      {
        name: "Powerbank and Chargers",
        subCategories: [
          "Wireless Powerbank",
          "Basic Powerbank",
          "Charging Pad",
          "Digital Powerbank",
          "Powerbank Folders",
        ],
      },
      {
        name: "Mugs",
        subCategories: [
          "Magic Mugs",
          "Ceramic Mugs",
          "Glass Mugs",
          "Stainless Steel Mugs",
          "Beer Mugs",
          "Double Wall Mugs",
          "Eco-Friendly Mugs",
        ],
      },
      {
        name: "Writing",
        subCategories: [
          "Plastic Pens",
          "Metal Pens",
          "USB Pens",
          "Pencils",
          "Crayons",
        ],
      },
    ];

    // Clear existing categories first
    console.log("Clearing existing categories...");
    await prisma.category.deleteMany({});

    // Create main categories first
    console.log("Creating main categories...");
    for (const category of categories) {
      const mainCategory = await prisma.category.create({
        data: {
          name: category.name,
          slug: slugify(category.name),
        },
      });

      // Create subcategories
      console.log(`Creating subcategories for ${category.name}...`);
      const subcategoryPromises = category.subCategories.map(
        (subCategoryName) =>
          prisma.category.create({
            data: {
              name: subCategoryName,
              slug: slugify(subCategoryName),
              parentId: mainCategory.id,
            },
          }),
      );

      await Promise.all(subcategoryPromises);
    }

    console.log("Category seeding completed successfully!");
    return { success: true, message: "Categories seeded successfully" };
  } catch (error) {
    console.error("Error seeding categories:", error);
    return { success: false, error: error.message };
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
        parent: true,
      },
    });
    return { success: true, categories };
  } catch (error) {
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function addCategory({ name, parentId = null }) {
  try {
    // Check if category with same name exists at same level
    const existing = await prisma.category.findFirst({
      where: {
        name,
        parentId,
      },
    });

    if (existing) {
      return {
        success: false,
        error: parentId
          ? "A subcategory with this name already exists"
          : "A category with this name already exists",
      };
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slugify(name),
        parentId,
      },
      include: {
        subcategories: true,
        parent: true,
      },
    });

    return { success: true, category };
  } catch (error) {
    return { success: false, error: "Failed to add category" };
  }
}

export async function updateCategory(id, { name, parentId = undefined }) {
  try {
    // Check if category with same name exists at same level
    const existing = await prisma.category.findFirst({
      where: {
        name,
        parentId: parentId ?? null,
        NOT: {
          id,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: parentId
          ? "A subcategory with this name already exists"
          : "A category with this name already exists",
      };
    }

    const updateData = {
      name,
      slug: slugify(name),
    };

    // Only include parentId in update if it's explicitly provided
    if (parentId !== undefined) {
      updateData.parentId = parentId;
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        subcategories: true,
        parent: true,
      },
    });

    return { success: true, category };
  } catch (error) {
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete category" };
  }
}
