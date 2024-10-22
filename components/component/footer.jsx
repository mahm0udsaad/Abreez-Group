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

const Footer = () => (
  <footer id="contact" className="bg-gray-100 p-12">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            About Abreez Group
          </h3>
          <p className="text-sm text-gray-600">
            Leading provider of promotional gifts and corporate solutions since
            2013. ISO certified with a strong presence in UAE and Saudi Arabia.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {["About Us", "Our Services", "Products", "Contact Us"].map(
              (item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {item}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Contact Us
          </h3>
          <address className="not-italic text-sm text-gray-600">
            <p className="flex items-center mb-2">
              <MapPin className="mx-2 h-4 w-4 text-blue-600" /> Al Wurud, King
              Abdul Aziz, Riyadh, Saudi Arabia
            </p>
            <p className="flex items-center mb-2">
              <Mail className="mx-2 h-4 w-4 text-blue-600" />{" "}
              info@abreezgroup.com
            </p>
            <p className="flex items-center mb-2">
              <Phone className="mx-2 h-4 w-4 text-blue-600" /> +966 56 000 6682
            </p>
            <p className="flex items-center">
              <Clock className="mx-2 h-4 w-4 text-blue-600" /> Mon - Sun / 9:00
              AM - 7:00 PM
            </p>
          </address>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Follow Us
          </h3>
          <div className="flex gap-4">
            {[Facebook, Twitter, Youtube, Instagram, Linkedin].map(
              (Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ),
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>&copy; 2023 Abreez Group - All Rights Reserved</p>
      </div>
    </div>
  </footer>
);
export default Footer;
