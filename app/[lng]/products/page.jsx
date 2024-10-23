import { ProductListing } from "@/components/product-listing";

// createa a async compoennt
export default async function ProductsPage({ params: { lng } }) {
  return <ProductListing lng={lng} />;
}
