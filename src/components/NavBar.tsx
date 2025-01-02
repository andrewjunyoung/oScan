import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center px-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="ml-4 text-lg font-semibold">My App</h1>
      </div>

      {/* Slide-out Menu */}
      <div className={`fixed top-16 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="py-4">
          <a href="#" className="block px-6 py-3 hover:bg-gray-100">Home</a>
          <a href="#" className="block px-6 py-3 hover:bg-gray-100">Profile</a>
          <a href="#" className="block px-6 py-3 hover:bg-gray-100">Settings</a>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NavBar;
