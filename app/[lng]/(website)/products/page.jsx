import { getAllProducts } from "@/actions/get-products";
import { ProductListing } from "@/components/product-listing";
import { motion } from "framer-motion";
export default async function ProductsPage({ params: { lng } }) {
  const ITEMS_PER_LOAD = 14;

  const { success, products, error } = await getAllProducts(0, ITEMS_PER_LOAD);

  if (!success) {
    return (
      <motion.p
        className="text-center text-gray-500 mt-8 text-xl min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error}
      </motion.p>
    );
  }

  return <ProductListing lng={lng} initialProducts={products} />;
}
