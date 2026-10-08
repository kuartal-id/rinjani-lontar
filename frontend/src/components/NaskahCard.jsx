import { Link } from 'react-router-dom';

const kondisiStyle = {
  'Baik': 'bg-green-50 text-green-700 border-green-200',
  'Perlu Perawatan': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Rusak': 'bg-red-50 text-red-700 border-red-200',
};

/**
 * Kartu satu naskah untuk ditampilkan di halaman Koleksi dan Tentang.
 * Props: naskah { id, kode_naskah, judul, foto_sampul, desa_asal, perkiraan_tahun, kondisi, kategori, pages_count }
 */
const NaskahCard = ({ naskah }) => {
  const {
    id,
    kode_naskah,
    judul,
    foto_sampul,
    desa_asal,
    perkiraan_tahun,
    kondisi,
    kategori,
    pages_count,
  } = naskah;

  const kondisiClass = kondisiStyle[kondisi] || 'bg-gray-50 text-gray-600 border-gray-200';

  return (
    <div className="museum-card group overflow-hidden flex flex-col h-full">
      {/* ── Foto Sampul ── */}
      <div className="relative h-44 bg-gray-100 overflow-hidden flex-shrink-0">
        {foto_sampul ? (
          <img
            src={foto_sampul}
            alt={judul}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
            <span className="text-5xl">📜</span>
            <span className="text-xs">Belum ada foto</span>
          </div>
        )}

        {/* Kode naskah */}
        {kode_naskah && (
          <div className="absolute top-3 left-3">
            <span className="bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase">
              {kode_naskah}
            </span>
          </div>
        )}

        {/* Kondisi */}
        {kondisi && (
          <div className="absolute top-3 right-3">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${kondisiClass}`}>
              {kondisi}
            </span>
          </div>
        )}

        {/* Kategori overlay bawah */}
        {kategori && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent flex items-end px-3 pb-2">
            <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest">
              {kategori}
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3 line-clamp-2 flex-grow">
          {judul}
        </h3>

        <div className="space-y-1.5 mb-4">
          {desa_asal && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>📍</span>
              <span className="line-clamp-1">{desa_asal}</span>
            </div>
          )}
          {perkiraan_tahun && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>📅</span>
              <span>{perkiraan_tahun}</span>
            </div>
          )}
          {pages_count !== undefined && pages_count !== null && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>📄</span>
              <span>{pages_count} halaman</span>
            </div>
          )}
        </div>

        <Link
          to={`/naskah/${id}`}
          className="w-full text-center bg-unesco-blue text-white text-xs font-semibold px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 shadow-sm block"
        >
          Lihat Naskah →
        </Link>
      </div>
    </div>
  );
};

export default NaskahCard;
