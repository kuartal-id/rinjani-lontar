import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Data menu beserta dropdown card-nya
const navItems = [
  {
    label: 'Tentang',
    to: '/',
    dropdown: {
      title: 'Tentang Platform',
      description: 'Platform arsip naskah lontar Sasak digital di kawasan UNESCO Global Geopark Rinjani.',
      links: [
        { icon: '🏛', label: 'Platform Digital', desc: 'Pengantar arsip naskah lontar' },
        { icon: '📜', label: 'Koleksi Unggulan', desc: 'Lontar pilihan yang telah dikurasi' },
        { icon: '🔔', label: 'Pembaruan Terkini', desc: 'Naskah lontar yang baru ditambahkan' },
      ],
    },
  },
  {
    label: 'Koleksi Lontar',
    to: '/koleksi',
    dropdown: {
      title: 'Koleksi Lontar',
      description: 'Telusuri koleksi naskah lontar Sasak berdasarkan kategori.',
      links: [
        { icon: '📚', label: 'Semua Koleksi', desc: 'Jelajahi seluruh arsip lontar' },
        { icon: '🗣️', label: 'Tradisi Lisan', desc: 'Cerita rakyat, mitos, dan tutur lisan' },
        { icon: '📜', label: 'Manuskrip', desc: 'Naskah kuno lontar beraksara Sasak' },
        { icon: '🎎', label: 'Adat Istiadat & Ritus', desc: 'Tradisi, upacara adat, dan kearifan lokal' },
      ],
    },
  },
];

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo & Title */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center gap-3 sm:gap-4 md:gap-5 group/logo" onClick={closeMobileMenu}>
              {/* Logos Container – nicely spaced */}
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-shrink-0">
                <img
                  src="/images/logo-geopark.png"
                  alt="UNESCO Global Geopark Logo"
                  className="h-9 sm:h-12 md:h-14 w-auto object-contain group-hover/logo:scale-[1.02] transition-transform duration-300"
                />
                <img
                  src="/images/logo-geopark2.png"
                  alt="Geopark Rinjani Lombok Logo"
                  className="h-7 sm:h-10 md:h-12 w-auto object-contain group-hover/logo:scale-[1.02] transition-transform duration-300"
                />
                <img
                  src="/images/logo-geopark3.png"
                  alt="Geopark Rinjani Lombok Logo 3"
                  className="h-7 sm:h-10 md:h-12 w-auto object-contain group-hover/logo:scale-[1.02] transition-transform duration-300"
                />
              </div>

              {/* Branding Text – with comfortable margin and padding */}
              <div className="hidden xs:flex flex-col justify-center border-l border-gray-200 pl-3 sm:pl-4 md:pl-5 py-1 min-w-0">
                <h1 className="text-xs sm:text-sm md:text-[17px] font-bold text-gray-900 leading-tight tracking-tight whitespace-nowrap">
                  Geopark Rinjani Lombok
                </h1>
                <p className="hidden sm:block text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold mt-1">
                  Naskah Lontar Sasak Digital
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation – desktop center with comfortable spacing */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.label)}
              >
                <Link
                  to={item.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium smooth-transition ${activeMenu === item.label
                    ? 'bg-unesco-blue text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {item.label}
                  <svg
                    className={`w-3.5 h-3.5 smooth-transition ${activeMenu === item.label ? 'rotate-180 text-white' : 'text-gray-400'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </div>
            ))}
          </nav>

          {/* CTA Button – desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/koleksi"
              className="bg-unesco-blue hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold smooth-transition shadow-sm"
            >
              Digitalisasi Lontar
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center ml-2 flex-shrink-0">
            <button
              className="text-gray-500 hover:text-gray-900 p-2 focus:outline-none rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mega Dropdown – desktop only */}
      {activeMenu && (() => {
        const item = navItems.find(n => n.label === activeMenu);
        if (!item) return null;
        return (
          <div
            className="absolute left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 hidden md:block"
            onMouseEnter={() => setActiveMenu(activeMenu)}
          >
            <div className="max-w-4xl mx-auto">
              <div
                className="bg-white rounded-b-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] border border-gray-100 border-t-0 overflow-hidden"
                style={{
                  animation: 'dropdownFadeIn 0.2s ease-out forwards',
                }}
              >
                <div className="grid grid-cols-3 gap-0">
                  {/* Left: Title & Description */}
                  <div className="col-span-1 bg-unesco-blue p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2">NAVIGASI</div>
                      <h3 className="text-lg font-bold text-white mb-2">{item.dropdown.title}</h3>
                      <p className="text-blue-100 text-xs leading-relaxed">{item.dropdown.description}</p>
                    </div>
                    <div className="mt-6">
                      <Link to="/koleksi" className="inline-flex items-center text-white text-xs font-semibold border border-white/30 px-3 py-1.5 rounded-lg hover:bg-white/10 smooth-transition">
                        Lihat Semua
                        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </Link>
                    </div>
                  </div>

                  {/* Right: Links */}
                  <div className="col-span-2 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.dropdown.links.map((link, idx) => (
                        <a
                          key={idx}
                          href="#"
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 smooth-transition group/link border border-transparent hover:border-gray-200"
                        >
                          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0 group-hover/link:bg-blue-100 smooth-transition">
                            {link.icon}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 mb-0.5 group-hover/link:text-unesco-blue smooth-transition">
                              {link.label}
                            </div>
                            <div className="text-xs text-gray-500 leading-relaxed line-clamp-1">{link.desc}</div>
                          </div>
                          <svg className="w-4 h-4 text-gray-300 ml-auto mt-0.5 opacity-0 group-hover/link:opacity-100 group-hover/link:text-unesco-blue smooth-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Mobile Menu – flat vertical list, clean and touch-friendly */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 right-0 top-full z-40 max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="flex flex-col py-3 px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold transition-colors border border-transparent ${
                  (item.to === '/' ? (location.pathname === '/' || location.pathname === '/tentang') : location.pathname === item.to)
                    ? 'bg-blue-50 text-unesco-blue border-blue-100'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="my-3 border-t border-gray-100" />

            {/* CTA Button */}
            <Link
              to="/koleksi"
              onClick={closeMobileMenu}
              className="flex items-center justify-center bg-unesco-blue hover:bg-blue-800 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-sm transition-colors"
            >
              Digitalisasi Lontar
            </Link>

            {/* Small bottom padding for safe area */}
            <div className="h-2" />
          </nav>
        </div>
      )}

      {/* Inline animation keyframe */}
      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* xs breakpoint workaround for Tailwind v4 */
        @media (max-width: 400px) {
          .hidden.xs\\:flex { display: none !important; }
        }
        @media (min-width: 401px) {
          .hidden.xs\\:flex { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
