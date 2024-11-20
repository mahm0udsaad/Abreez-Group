// app/actions/services.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createService(data) {
  try {
    const service = await prisma.service.create({
      data: {
        title: data.title,
        image: data.image,
        category: data.category,
      },
    });

    revalidatePath("/admin/services");
    revalidatePath("/");
    return { success: true, data: service };
  } catch (error) {
    console.error("Failed to create service:", error);
    return { success: false, error: "Failed to create service" };
  }
}

// Get all services
export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return { success: false, error: "Failed to fetch services" };
  }
}

// Get a single service
export async function getService(id) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      return { success: false, error: "Service not found" };
    }
    return { success: true, data: service };
  } catch (error) {
    console.error("Failed to fetch service:", error);
    return { success: false, error: "Failed to fetch service" };
  } finally {
    revalidatePath("/dashboard/landing-page-manager");
  }
}

// Update a service
export async function updateService(id, data) {
  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        title: data.title,
        image: data.image,
        category: data.category,
      },
    });

    revalidatePath("/admin/services");
    revalidatePath("/");
    return { success: true, data: service };
  } catch (error) {
    console.error("Failed to update service:", error);
    return { success: false, error: "Failed to update service" };
  } finally {
    revalidatePath("/dashboard/landing-page-manager");
  }
}

// Delete a service
export async function deleteService(id) {
  try {
    await prisma.service.delete({
      where: { id },
    });

    revalidatePath("/admin/services");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete service:", error);
    return { success: false, error: "Failed to delete service" };
  }
}

// Get services by category
export async function getServicesByCategory(category) {
  try {
    const services = await prisma.service.findMany({
      where: { category },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error("Failed to fetch services by category:", error);
    return { success: false, error: "Failed to fetch services by category" };
  }
}
