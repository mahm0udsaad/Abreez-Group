import { getAllProducts } from "@/actions/get-products";
import { ProductListing } from "@/components/product-listing";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ params: { lng } }) {
  const ITEMS_PER_LOAD = 15;

  const { success, products, error } = await getAllProducts(0, ITEMS_PER_LOAD);

  if (!success) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-xl"
        >
          {error || "Failed to load products"}
        </motion.p>
      </div>
    );
  }

  return <ProductListing lng={lng} initialProducts={products} />;
}
