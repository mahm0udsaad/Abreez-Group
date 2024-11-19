"use server";
import { uploadToCloud } from "@/lib/cloud";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function uploadHeroImage(formData) {
  try {
    const result = await uploadToCloud(formData);

    console.log(result.adImage);
    const imagesCount = (await prisma.heroImage.count()) || 0;
    console.log("imagesCount", imagesCount);

    // Store in database
    const heroImage = await prisma.heroImage.create({
      data: {
        url: result.adImage,
        sortOrder: imagesCount, // Add to end of list
      },
    });

    revalidatePath("/");
    return { success: true, imageUrl: result.adImage, id: heroImage.id };
  } catch (error) {
    console.error("Error uploading hero image:", error);
    return { success: false, error: error.message };
  }
}

export async function getHeroImages() {
  try {
    const images = await prisma.heroImage.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });
    return { success: true, images };
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return { success: false, error: error.message };
  }
}

export async function updateHeroImageOrder(images) {
  try {
    // Update each image's sort order
    await Promise.all(
      images.map((image, index) =>
        prisma.heroImage.update({
          where: { id: image.id },
          data: { sortOrder: index },
        }),
      ),
    );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating hero image order:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteHeroImage(id) {
  try {
    await prisma.heroImage.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting hero image:", error);
    return { success: false, error: error.message };
  }
}
