import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image 
              src="/design/assets/logos/company_logo.svg" 
              alt="Company Logo" 
              width={180} 
              height={40} 
            />
          </div>
          <div className="flex space-x-4">
            <Link href="/about" className="text-white hover:text-gray-400">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-400">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Moodboard AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
