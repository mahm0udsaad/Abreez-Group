import { getUsers, isUserAllowed } from "@/actions/admin";
import { getAllProducts } from "@/actions/product";
import ProductsView from "@/components/pages/dashboard-products-page";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ params: { lng } }) {
  const user = await currentUser();
  const email = user.emailAddresses[0].emailAddress;
  const result = await isUserAllowed(email);
  if (!result) redirect("/");
  const { products } = await getAllProducts();

  return (
    <div>
      <ProductsView initialProducts={products} lng={lng} />
    </div>
  );
}
