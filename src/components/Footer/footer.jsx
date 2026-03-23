import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050A30] text-white mt-10">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">

        {/* Hotel Info */}
        <div>
          <h2 className="text-2xl font-bold text-[#E8D9C4] mb-3">Aurora Haven</h2>
          <p className="text-gray-300 text-sm">
            Experience luxury and comfort at Aurora Haven Hotel. 
            Your perfect getaway for relaxation and unforgettable moments.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>

          <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <FaMapMarkerAlt />
            <span>123 Luxury Lane, Paradise City, Colombo, Sri Lanka</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <FaPhone />
            <span>+94 76 221 9874 </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <FaEnvelope />
            <span>info@aurorahaven.com</span>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>

          <div className="flex gap-4 text-xl">
            <FaFacebook className="hover:text-[#E8D9C4] cursor-pointer" />
            <FaInstagram className="hover:text-[#E8D9C4] cursor-pointer" />
            <FaTwitter className="hover:text-[#E8D9C4] cursor-pointer" />
          </div>

          <p className="text-gray-400 text-sm mt-4">
            Stay connected with us on social media.
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-gray-400 text-sm">
        © 2026 Aurora Haven Hotel | All Rights Reserved
      </div>

    </footer>
  );
}