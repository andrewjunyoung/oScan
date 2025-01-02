import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
      <div className="flex items-center gap-4 p-4 bg-white shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-gray-100 p-2 rounded-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1>My App</h1>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-b-lg py-2">
          <Link to="/" className="block px-4 py-2 hover:bg-gray-100">
            Home
          </Link>
          <Link to="/scan" className="block px-4 py-2 hover:bg-gray-100">
            Scan
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
