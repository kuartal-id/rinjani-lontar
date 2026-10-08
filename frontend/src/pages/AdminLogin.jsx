import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiArrowLeft, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to /admin or previous route
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const destination = location.state?.from?.pathname || '/admin';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Silakan masukkan email atau username Anda.');
      return;
    }
    if (!password) {
      setError('Silakan masukkan password akun administrator.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        const destination = location.state?.from?.pathname || '/admin';
        navigate(destination, { replace: true });
      } else {
        setError(result.message || 'Kredensial tidak valid. Silakan periksa kembali.');
      }
    } catch {
      setError('Terjadi kendala koneksi ke server. Pastikan backend aktif.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Branding / Logo Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2.5 justify-center mb-5 group">
          <img
            src="/images/logo-geopark.png"
            alt="UNESCO Geopark"
            className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <img
            src="/images/logo-geopark2.png"
            alt="Geopark Rinjani"
            className="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <img
            src="/images/logo-geopark3.png"
            alt="Geopark Logo"
            className="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Portal Masuk Administrator
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Naskah Lontar Sasak Digital &bull; Geopark Rinjani Lombok
        </p>
      </div>

      {/* Login Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-[0_4px_25px_-2px_rgba(0,0,0,0.06)] border border-gray-100">
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-unesco-blue flex items-center justify-center flex-shrink-0">
              <FiShield size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Autentikasi Aman</h3>
              <p className="text-xs text-gray-500">Khusus administrator & pengelola data naskah</p>
            </div>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 animate-fade-in text-sm">
              <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Username Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Email / Username
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiUser size={18} />
                </div>
                <input
                  id="admin-email"
                  type="text"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Adminweblontar"
                  className="w-full pl-10 pr-3.5 py-3 rounded-lg border border-gray-300 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-unesco-blue focus:border-unesco-blue transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiLock size={18} />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="admin"
                  className="w-full pl-10 pr-11 py-3 rounded-lg border border-gray-300 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-unesco-blue focus:border-unesco-blue transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-unesco-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-unesco-blue transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  'Masuk ke Dashboard'
                )}
              </button>
            </div>
          </form>

          {/* Footer inside card */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <Link to="/" className="inline-flex items-center gap-1.5 text-unesco-blue hover:underline font-medium">
              <FiArrowLeft size={13} />
              Kembali ke Beranda
            </Link>
            <Link to="/koleksi" className="text-gray-500 hover:text-gray-800 hover:underline">
              Koleksi Lontar &rarr;
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
          Dilindungi oleh sistem otorisasi token Laravel Sanctum &bull; Geopark Rinjani Lombok
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
