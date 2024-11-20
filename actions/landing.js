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
export async function getHeroImageUrls() {
  try {
    const images = await prisma.heroImage.findMany({
      select: {
        url: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
    return { success: true, images: images.map((image) => image.url) };
  } catch (error) {
    console.error("Error fetching hero image urls:", error);
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
// Get all social links
export async function getSocialLinks() {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: links };
  } catch (error) {
    console.error("Failed to fetch social links:", error);
    return { success: false, error: "Failed to fetch social links" };
  }
}

export async function upsertSocialLinks(links) {
  try {
    const updatedLinks = [];

    for (const link of links) {
      // Check if the link exists in the database
      const existingLink = await prisma.socialLink.findUnique({
        where: { platform: link.platform }, // platform must be unique
      });

      if (existingLink) {
        // Update the existing link
        const updatedLink = await prisma.socialLink.update({
          where: { id: existingLink.id },
          data: { url: link.url },
        });
        updatedLinks.push(updatedLink);
      } else {
        // Create a new link
        const createdLink = await prisma.socialLink.create({
          data: { platform: link.platform, url: link.url },
        });
        updatedLinks.push(createdLink);
      }
    }

    // Revalidate path or perform other post-processing
    revalidatePath("/");

    return {
      success: true,
      data: updatedLinks,
    };
  } catch (error) {
    console.error("Failed to update social links:", error);
    return {
      success: false,
      error: "Failed to update social links",
    };
  }
}
