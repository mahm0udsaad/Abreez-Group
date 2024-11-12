"use client";
import { useState } from "react";
import { EditProductCard } from "./EditProductCard";
import { ViewProductCard } from "./ViewProductCard";

export default function ProductCard({ product: initialProduct, lng }) {
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
      lng={lng}
      product={product}
      onCancel={handleCancel}
      onSave={handleSave}
    />
  ) : (
    <ViewProductCard
      lng={lng}
      setProduct={setProduct}
      product={product}
      onEditClick={handleEdit}
    />
  );
}
