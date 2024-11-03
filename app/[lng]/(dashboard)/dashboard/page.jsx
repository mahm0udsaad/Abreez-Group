import { getAllProducts } from "@/actions/product";
import ProductsView from "@/components/pages/dashboard-products-page";
import React from "react";

export default async function DashboardPage() {
  const { products } = await getAllProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Dashboard</h1>
      <ProductsView initialProducts={products} />
    </div>
  );
}
