import { useTranslation } from "@/app/i18n";
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

const Footer = async ({ lng }) => {
  const { t } = await useTranslation(lng, "common"); // Get the t function from useTranslation
  const navItems = [
    { name: t("navigation.home"), href: "#" },
    { name: t("navigation.about"), href: "#about" },
    { name: t("navigation.services"), href: "#services" },
    { name: t("navigation.portfolio"), href: "#portfolio" },
    { name: t("navigation.testimonials"), href: "#testimonials" },
    { name: t("navigation.faq"), href: "#faq" },
    { name: t("navigation.contact"), href: "#contact" },
  ];
  return (
    <footer id="contact" className="bg-[#114270] p-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#8cc63f]">
              {t("footer.about.title")}
            </h3>
            <p className="text-sm text-white">
              {t("footer.about.description")}
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#8cc63f]">
              {t("footer.quickLinks.title")}
            </h3>
            <ul className="space-y-2 text-sm text-white">
              {navItems.map((key) => (
                <li key={key.name}>
                  <a
                    href={key.href}
                    className="hover:text-[#8cc63f] transition-colors"
                  >
                    {key.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#8cc63f]">
              {t("footer.contactUs.title")}
            </h3>
            <address className="not-italic text-sm text-white">
              <p className="flex items-center mb-2">
                <MapPin className="mx-2 h-4 w-4 text-[#8cc63f]" />{" "}
                {t("footer.contactUs.details.address")}
              </p>
              <p className="flex items-center mb-2">
                <Mail className="mx-2 h-4 w-4 text-[#8cc63f]" />{" "}
                {t("footer.contactUs.details.email")}
              </p>
              <p className="flex items-center mb-2">
                <Phone className="mx-2 h-4 w-4 text-[#8cc63f]" />{" "}
                {t("footer.contactUs.details.phone")}
              </p>
              <p className="flex items-center">
                <Clock className="mx-2 h-4 w-4 text-[#8cc63f]" />{" "}
                {t("footer.contactUs.details.hours")}
              </p>
            </address>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#8cc63f]">
              {t("footer.socialMedia.title")}
            </h3>
            <div className="flex gap-4">
              {[Facebook, Twitter, Youtube, Instagram, Linkedin].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-[#8cc63f] transition-colors"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-white">
          <p>{t("footer.footerNote")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
