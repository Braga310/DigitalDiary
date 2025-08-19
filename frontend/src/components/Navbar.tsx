import { Link, useLocation } from "react-router-dom";
import landingPageLogo from "../imgs/landingPageLogo.jpg";

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/planner", label: "Planner" },
    { path: "/doctorLedger", label: "Doctor Ledger" },
    { path: "/expenses", label: "Expenses" },
  ];

  return (
    <nav className="w-full h-16 fixed left-0">
      <div className="bg-zinc-500 h-full w-full px-8 flex items-center">
        {/* Logo on the left */}
        <div className="flex-shrink-0 mr-8">
          <img
            src={landingPageLogo}
            alt="Digital Diary Logo"
            className="h-12 w-auto object-contain"
          />
        </div>
        {/* Navigation items in the center */}
        <div className="flex-1 flex justify-center">
          <ul className="flex flex-row items-center gap-16 text-2xl">
            {navItems.map(({ path, label }) => (
              <li key={path} className="relative cursor-pointer group">
                <Link
                  to={path}
                  className={`relative px-2 py-1 transition-colors duration-200 ${
                    currentPath === path
                      ? "text-amber-300 font-semibold"
                      : "text-white hover:text-zinc-200"
                  }`}
                >
                  {label}
                  <span
                    className={`block absolute left-0 right-0 -bottom-1 h-[2px] transition-all duration-300 ${
                      currentPath === path
                        ? "bg-amber-300 scale-x-100"
                        : "bg-transparent group-hover:bg-white scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
