import React from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2C2C2C] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#99582A] rounded flex items-center justify-center">
                <span className="text-white font-bold">SH</span>
              </div>
              <span className="text-white font-semibold">SpicesHub</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Quality products, exceptional service, delivered to your door.
            </p>
            <div className="flex gap-4">
              <button className="hover:text-[#FFE6A7] transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="hover:text-[#FFE6A7] transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="hover:text-[#FFE6A7] transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="hover:text-[#FFE6A7] transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-[#FFE6A7] font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button className="hover:text-white transition-colors">New Arrivals</button></li>
              <li><button className="hover:text-white transition-colors">Best Sellers</button></li>
              <li><button className="hover:text-white transition-colors">Sale</button></li>
              <li><button className="hover:text-white transition-colors">Gift Cards</button></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4 text-[#FFE6A7] font-semibold">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button className="hover:text-white transition-colors">Contact Us</button></li>
              <li><button className="hover:text-white transition-colors">Shipping Info</button></li>
              <li><button className="hover:text-white transition-colors">Returns</button></li>
              <li><button className="hover:text-white transition-colors">FAQ</button></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-4 text-[#FFE6A7] font-semibold">About</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button className="hover:text-white transition-colors">Our Story</button></li>
              <li><button className="hover:text-white transition-colors">Sustainability</button></li>
              <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 Your Brand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;