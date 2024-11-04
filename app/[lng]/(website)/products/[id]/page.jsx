import { getProductById } from "@/actions/product";
import ProductDetailsPage from "@/components/pages/product-details";

export default async function ProductPage({ params: { id, lng } }) {
  const { success, product } = await getProductById(id);
  console.log(product);

  if (!success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-3xl">product_not_found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProductDetailsPage product={product} />
    </div>
  );
}
