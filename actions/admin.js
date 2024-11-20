"use server";

import prisma from "@/lib/prisma";

export async function fetchUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true },
    });
    return users;
  } catch (error) {
    throw new Error("Failed to fetch users: " + error.message);
  }
}

export async function deleteUserByEmail(email) {
  if (!email) {
    throw new Error("Email is required.");
  }

  try {
    await prisma.user.delete({
      where: { email },
    });
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete user: " + error.message);
  }
}

export async function isUserAllowed(email) {
  if (!email) {
    throw new Error("Email is required.");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? true : false;
  } catch (error) {
    throw new Error("Failed to check user: " + error.message);
  }
}
export async function addUserByEmail(email) {
  if (!email) {
    throw new Error("Email is required.");
  }

  // Ensure the email format is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email address.");
  }

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return { success: true, user };
  } catch (error) {
    throw new Error("Failed to add user: " + error.message);
  }
}
