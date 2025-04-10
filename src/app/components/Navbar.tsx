import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          PDF Compression Tool
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link href="/compress" className="text-white hover:text-gray-300">
            Compress
          </Link>
          <Link href="/decompress" className="text-white hover:text-gray-300">
            Decompress
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
