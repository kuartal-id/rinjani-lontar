import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa6';

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/GeoparkRinjaniLombok',
    icon: FaFacebookF,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/inforinjani/',
    icon: FaInstagram,
  },
  {
    label: 'YouTube',
    href: 'http://www.youtube.com/@rinjanilombokunescoglobalg8116',
    icon: FaYoutube,
  },
];

const Footer = () => {
  return (
    <footer className="bg-unesco-blue text-white pt-10 md:pt-16 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">

          {/* Brand & Media Sosial */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-wrap items-center gap-3.5 mb-6">
              <div className="bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-2 sm:gap-2.5 shadow-sm flex-shrink-0">
                <img
                  src="/images/logo-geopark.png"
                  alt="UNESCO Global Geopark Logo"
                  className="h-8 sm:h-9 w-auto object-contain"
                />
                <img
                  src="/images/logo-geopark2.png"
                  alt="Geopark Rinjani Lombok Logo"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
                <img
                  src="/images/logo-geopark3.png"
                  alt="Geopark Rinjani Lombok Logo 3"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-bold tracking-tight text-white leading-tight">Geopark Rinjani</h2>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold mt-0.5">Lombok</p>
              </div>
            </div>
            <p className="text-blue-100 mb-6 max-w-md leading-relaxed text-sm">
              Platform arsip naskah lontar Sasak digital. Merupakan dedikasi dan upaya berkelanjutan dalam pelestarian warisan budaya takbenda di kawasan UNESCO Global Geopark Rinjani.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((s) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="w-10 h-10 rounded-full border border-blue-400 flex items-center justify-center text-sm font-semibold hover:bg-white hover:text-unesco-blue smooth-transition text-white"
                  >
                    <IconComponent size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-bold mb-5 uppercase tracking-widest border-b border-blue-700 pb-2">
              Tautan Cepat
            </h3>
            <ul className="space-y-3 text-sm text-blue-100">
              {[
                { label: 'Tentang', to: '/' },
                { label: 'Koleksi Lontar', to: '/koleksi' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-white smooth-transition flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-bold mb-5 uppercase tracking-widest border-b border-blue-700 pb-2">
              Kontak
            </h3>
            <ul className="space-y-4 text-sm text-blue-100">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="leading-relaxed">Jl. Langko No. 69, Mataram,<br />Nusa Tenggara Barat, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>geoparkrinjani.dph@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>+6287 6591 0487</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-blue-200">
          <p>&copy; {new Date().getFullYear()} Geopark Rinjani Lombok. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <span className="font-semibold tracking-widest uppercase">Naskah Lontar Sasak Digital</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
