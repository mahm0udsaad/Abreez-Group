import { EnhancedLandingPage } from "@/components/pages/enhanced-landing-page";

const HomePage = async ({ params: { lng } }) => {
  return <EnhancedLandingPage lng={lng} />;
};

export default HomePage;
