import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NaskahCard from '../components/NaskahCard';

const KATEGORI_LIST = [
  'Semua',
  'Tradisi Lisan',
  'Manuskrip',
  'Adat Istiadat',
  'Ritus',
  'Pengetahuan Tradisional',
  'Teknologi Tradisional',
  'Seni',
  'Bahasa',
  'Permainan Rakyat',
  'Olahraga Tradisional',
];

const Collection = () => {
  const [lontars, setLontars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('Semua');

  useEffect(() => {
    fetchLontars();
  }, []);

  const fetchLontars = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/lontars');
      const data = Array.isArray(res.data) ? res.data : [];
      setLontars(data);
    } catch {
      setLontars([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = lontars.filter((n) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      n.judul?.toLowerCase().includes(q) ||
      n.kode_naskah?.toLowerCase().includes(q) ||
      n.desa_asal?.toLowerCase().includes(q);
    const matchKategori = kategori === 'Semua' || n.kategori === kategori;
    return matchSearch && matchKategori;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <Link to="/" className="hover:text-gray-600">Tentang</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Koleksi Lontar</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Koleksi Naskah Lontar</h1>
          <p className="text-gray-500 max-w-2xl">
            Telusuri koleksi naskah lontar Sasak yang telah didigitalisasi oleh Geopark Rinjani. Setiap naskah berisi banyak lembar dengan foto, penjelasan, dan rekaman pembacaan.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Filter & Search ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-col sm:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul naskah, kode, atau lokasi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Kategori Filter */}
          <div className="flex gap-2 flex-wrap">
            {KATEGORI_LIST.map((k) => (
              <button
                key={k}
                onClick={() => setKategori(k)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                  kategori === k
                    ? 'bg-unesco-blue text-white border-unesco-blue'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results Info ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {loading ? 'Memuat...' : (
              <>Menampilkan <span className="font-bold text-gray-800">{filtered.length}</span> naskah</>
            )}
          </p>
          {(search || kategori !== 'Semua') && (
            <button
              onClick={() => { setSearch(''); setKategori('Semua'); }}
              className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              ✕ Hapus filter
            </button>
          )}
        </div>

        {/* ── Grid Naskah ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="museum-card h-72 animate-pulse bg-gray-100 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4 opacity-20">📜</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Belum ada koleksi lontar</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
              Tidak ada naskah yang sesuai dengan pencarian/filter Anda, atau koleksi naskah masih dalam proses digitalisasi dan belum ditambahkan oleh Admin.
            </p>
            {(search || kategori !== 'Semua') && (
              <button
                onClick={() => { setSearch(''); setKategori('Semua'); }}
                className="text-sm font-semibold text-unesco-blue hover:underline"
              >
                Tampilkan Semua Naskah
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((n) => (
              <NaskahCard key={n.id} naskah={n} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
