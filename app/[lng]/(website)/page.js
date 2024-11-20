import { getHeroImageUrls } from "@/actions/landing";
import { EnhancedLandingPage } from "@/components/pages/enhanced-landing-page";

const HomePage = async ({ params: { lng } }) => {
  const heroImages = await getHeroImageUrls();

  return <EnhancedLandingPage lng={lng} heroImages={heroImages.images} />;
};

export default HomePage;
