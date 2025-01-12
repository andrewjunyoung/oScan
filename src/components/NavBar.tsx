import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="z-50">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 flex items-center gap-4 p-4 bg-white shadow-sm">
        <button onClick={() => setIsOpen(!isOpen)} className="hover:bg-gray-100 p-2 rounded-lg">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center gap-2">
          <img src="/favicon.png" alt="" className="h-6 w-6" />
          <h1>oScan</h1>
        </div>
      </div>

      {/* Sliding menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="pt-20">
          <Link to="/" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/scan" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Scan</Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
