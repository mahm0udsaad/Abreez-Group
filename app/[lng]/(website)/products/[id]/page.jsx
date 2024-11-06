import { getProductById } from "@/actions/product";
import { getAllProductIds } from "@/actions/get-products";
import ProductDetailsPage from "@/components/pages/product-details";

// Assuming you have i18n configured with supported languages
const languages = ["en", "ar"]; // Add all your supported languages

export async function generateStaticParams() {
  const { success, products } = await getAllProductIds();

  if (!success) {
    console.error("Failed to generate static params for products");
    return [];
  }

  // Generate combinations of language and product ID
  const params = products.flatMap((product) =>
    languages.map((lng) => ({
      lng,
      id: product.id,
    })),
  );

  return params;
}

export default async function ProductPage({ params: { id, lng } }) {
  const { success, product } = await getProductById(id);

  if (!success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-3xl">product_not_found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProductDetailsPage product={product} lng={lng} />
    </div>
  );
}

// Add metadata generation (optional but recommended)
export async function generateMetadata({ params: { id } }) {
  const { success, product } = await getProductById(id);

  if (!success) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.colors?.[0]?.image ? [product.colors[0].image] : [],
    },
  };
}
