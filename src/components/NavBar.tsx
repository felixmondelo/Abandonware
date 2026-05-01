import { Link, useLocation } from 'react-router-dom';

export function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav className="border-b border-gray-800 bg-black px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <span className="text-dos-text font-pixel text-sm leading-none text-glow-dos">
          ABANDONWARE
        </span>
        <span className="text-gray-600 font-mono text-xs hidden sm:block">
          retro gaming archive
        </span>
      </Link>

      <div className="flex items-center gap-4 font-pixel text-[10px]">
        <Link
          to="/"
          className={`transition-colors ${
            pathname === '/'
              ? 'text-dos-text text-glow-dos'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          HOME
        </Link>
        <Link
          to="/library"
          className={`transition-colors ${
            pathname === '/library'
              ? 'text-dos-text text-glow-dos'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          LIBRARY
        </Link>
      </div>
    </nav>
  );
}
