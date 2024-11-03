"use client";
import { useState } from "react";
import { EditProductCard } from "./EditProductCard";
import { ViewProductCard } from "./ViewProductCard";

export default function ProductCard({ product: initialProduct }) {
  const [product, setProduct] = useState(initialProduct);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEdit = () => setIsEditMode(true);
  const handleCancel = () => setIsEditMode(false);
  const handleSave = (updatedProduct) => {
    setProduct(updatedProduct);
    setIsEditMode(false);
  };

  return isEditMode ? (
    <EditProductCard
      product={product}
      onCancel={handleCancel}
      onSave={handleSave}
    />
  ) : (
    <ViewProductCard
      setProduct={setProduct}
      product={product}
      onEditClick={handleEdit}
    />
  );
}
