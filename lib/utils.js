import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function slugify(str) {
  return (
    str
      // Convert to lowercase
      .toLowerCase()
      // Remove diacritics (accents)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Replace spaces and special characters with hyphens
      .replace(/[^a-z0-9]+/g, "-")
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, "")
      // Collapse multiple consecutive hyphens
      .replace(/-+/g, "-")
  );
}

export function generateUniqueSlug(str, existingSlugs = []) {
  let slug = slugify(str);
  let uniqueSlug = slug;
  let counter = 1;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
