import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedinIn,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import logo from "../assets/logo.svg";

const Footer = () => {
  return (
    <footer className="bg-[#043873] text-white py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <img src={logo} alt="VoteSwift-logo" />
            <p className="text-sm text-gray-400">
              Engage and make decisions effectively
            </p>
          </div>

          <div className="flex space-x-6">
            <a href="/" className="text-gray-400 hover:text-white transition">
              Home
            </a>
            <a
              href="/about"
              className="text-gray-400 hover:text-white transition"
            >
              About Us
            </a>
            <a
              href="/contact"
              className="text-gray-400 hover:text-white transition"
            >
              Contact
            </a>
            <a
              href="/faq"
              className="text-gray-400 hover:text-white transition"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>

          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Pollify. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
