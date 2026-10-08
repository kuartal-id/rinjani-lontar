import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ImageViewer from '../components/ImageViewer';
import AudioPlayer from '../components/AudioPlayer';

const kondisiStyle = {
  'Baik': { cls: 'bg-green-50 text-green-700 border-green-200', icon: '✓' },
  'Perlu Perawatan': { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '⚠' },
  'Rusak': { cls: 'bg-red-50 text-red-700 border-red-200', icon: '✕' },
};

const ManuscriptDetail = () => {
  const { id } = useParams();
  const [naskah, setNaskah] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showFullRingkasan, setShowFullRingkasan] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/lontars/${id}`);
        const data = res.data;
        setNaskah(data);
        const pages = data.pages || [];
        if (pages.length > 0) setSelectedPage(pages[0]);
      } catch {
        setNaskah(null);
        setSelectedPage(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const pages = naskah?.pages || [];
  const selectedIdx = pages.findIndex(p => p.id === selectedPage?.id);
  const hasPrev = selectedIdx > 0;
  const hasNext = selectedIdx < pages.length - 1;

  const handlePrev = () => { if (hasPrev) setSelectedPage(pages[selectedIdx - 1]); };
  const handleNext = () => { if (hasNext) setSelectedPage(pages[selectedIdx + 1]); };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">📜</div>
          <p className="text-gray-500">Memuat naskah...</p>
        </div>
      </div>
    );
  }

  if (!naskah) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Naskah Tidak Ditemukan</h2>
          <Link to="/koleksi" className="text-sm text-unesco-blue hover:underline">← Kembali ke Koleksi</Link>
        </div>
      </div>
    );
  }

  const cond = kondisiStyle[naskah.kondisi] || kondisiStyle['Baik'];
  const pageCond = selectedPage ? (kondisiStyle[selectedPage.kondisi] || kondisiStyle['Baik']) : null;

  // ── Shared: Naskah Header Bar (used by both desktop and mobile) ──
  const NaskahHeader = () => (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-gray-600">Tentang</Link>
          <span>/</span>
          <Link to="/koleksi" className="hover:text-gray-600">Koleksi Lontar</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium line-clamp-1">{naskah.judul}</span>
        </nav>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {naskah.kode_naskah && (
                <span className="text-[11px] font-bold text-unesco-blue uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                  {naskah.kode_naskah}
                </span>
              )}
              {naskah.kategori && (
                <span className="text-[11px] font-semibold text-heritage-brown bg-amber-50 px-2 py-0.5 rounded">
                  {naskah.kategori}
                </span>
              )}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cond.cls}`}>
                {cond.icon} {naskah.kondisi}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 leading-tight mb-1">
              {naskah.judul}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              {naskah.desa_asal && <span>📍 {naskah.desa_asal}</span>}
              {naskah.perkiraan_tahun && <span>📅 {naskah.perkiraan_tahun}</span>}
              {naskah.bahasa && <span>🗣 Bahasa {naskah.bahasa}</span>}
              <span>📄 {pages.length} halaman</span>
            </div>
          </div>
          <Link
            to="/koleksi"
            className="flex-shrink-0 text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-2 rounded-lg hover:border-gray-300 transition-colors whitespace-nowrap"
          >
            ← Koleksi
          </Link>
        </div>

        {naskah.ringkasan && (
          <div className="mt-3 border-t border-gray-100 pt-3 max-w-4xl">
            <p className={`text-sm text-gray-600 leading-relaxed whitespace-pre-line ${!showFullRingkasan && naskah.ringkasan.length > 200 ? 'line-clamp-2' : ''}`}>
              {naskah.ringkasan}
            </p>
            {naskah.ringkasan.length > 200 && (
              <button
                onClick={() => setShowFullRingkasan(prev => !prev)}
                className="mt-1.5 text-xs font-semibold text-unesco-blue hover:text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                {showFullRingkasan ? '▲ Sembunyikan ringkasan' : '▼ Baca ringkasan selengkapnya'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ── Shared: single lembar thumbnail button ──
  const LembarThumb = ({ page, compact = false }) => {
    const isActive = selectedPage?.id === page.id;
    const pc = kondisiStyle[page.kondisi] || kondisiStyle['Baik'];
    return (
      <button
        onClick={() => setSelectedPage(page)}
        className={`text-left rounded-xl border transition-all duration-150 overflow-hidden group ${
          isActive
            ? 'border-blue-200 bg-blue-50 shadow-sm'
            : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
        } ${compact ? 'w-20' : 'w-full'}`}
      >
        {/* Thumbnail */}
        <div className={`w-full bg-gray-100 overflow-hidden ${compact ? 'h-14' : 'h-14'}`}>
          {page.foto_halaman ? (
            <img
              src={page.foto_halaman}
              alt={`Lembar ${page.nomor_lembar}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📜</div>
          )}
        </div>
        <div className="px-1.5 py-1.5">
          <div className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 truncate ${isActive ? 'text-unesco-blue' : 'text-gray-400'}`}>
            {compact ? `L${page.nomor_lembar}` : `Lembar ${page.nomor_lembar}`}
          </div>
          {!compact && page.judul_halaman && (
            <p className="text-[10px] font-semibold text-gray-700 line-clamp-2 leading-snug mb-1">
              {page.judul_halaman}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className={`text-[8px] font-bold px-1 py-0.5 rounded border ${pc.cls}`}>
              {pc.icon}
            </span>
            {page.audio_file && (
              <span className="text-[9px] text-blue-500">🎧</span>
            )}
          </div>
        </div>
      </button>
    );
  };

  // ── Shared: info + audio panel content ──
  const InfoPanel = () => (
    <>
      {selectedPage ? (
        <div className="p-4 sm:p-5">
          {/* Lembar header */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Lembar {selectedPage.nomor_lembar}
              </span>
              {selectedPage.kondisi && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${pageCond?.cls}`}>
                  {pageCond?.icon} {selectedPage.kondisi}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              {selectedPage.judul_halaman || `Lembar ${selectedPage.nomor_lembar}`}
            </h3>
          </div>

          {/* Penjelasan */}
          {selectedPage.penjelasan && (
            <div className="mb-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Penjelasan</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedPage.penjelasan}</p>
            </div>
          )}

          {/* Catatan */}
          {selectedPage.catatan && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <h4 className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Catatan Khusus</h4>
              <p className="text-xs text-amber-800 leading-relaxed">{selectedPage.catatan}</p>
            </div>
          )}

          {/* Navigasi antar lembar */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="flex-1 py-2.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="flex-1 py-2.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya →
            </button>
          </div>

          {/* Audio Pembacaan */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Audio Pembacaan</h4>
            <AudioPlayer
              src={selectedPage.audio_file}
              namaPembaca={selectedPage.nama_pembaca}
              verified={selectedPage.audio_verified}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
          <div className="text-4xl mb-3 opacity-20">ℹ️</div>
          <p className="text-sm">Pilih lembar untuk melihat informasi</p>
        </div>
      )}
    </>
  );

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <NaskahHeader />

      {/* ══════════════════════════════════════
          DESKTOP LAYOUT (lg and above)
          Exact 3-panel layout – unchanged
      ══════════════════════════════════════ */}
      <div
        className="hidden lg:flex flex-1 overflow-hidden mb-16"
        style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}
      >
        {/* Panel Kiri: Daftar Lembar */}
        <div
          className={`${sidebarOpen ? 'w-56' : 'w-0'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden transition-all duration-300`}
        >
          {/* Header panel kiri */}
          <div className="px-3 py-3 border-b border-gray-100 bg-gray-50/60 flex-shrink-0">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-unesco-blue" />
              {naskah.kode_naskah || 'Naskah'}
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">{pages.length} halaman</p>
          </div>

          {/* Daftar lembar */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {pages.map((page) => (
              <LembarThumb key={page.id} page={page} compact={false} />
            ))}
          </div>
        </div>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(s => !s)}
          className="w-5 flex-shrink-0 bg-gray-50 border-r border-gray-100 hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-400 hover:text-gray-700 text-xs"
          title={sidebarOpen ? 'Tutup panel' : 'Buka panel'}
        >
          {sidebarOpen ? '‹' : '›'}
        </button>

        {/* Panel Tengah: Image Viewer */}
        <div className="flex-1 overflow-hidden bg-gray-900/5 flex flex-col">
          {selectedPage ? (
            <ImageViewer
              foto={selectedPage.foto_enhanced || selectedPage.foto_halaman}
              judul={selectedPage.judul_halaman || `Lembar ${selectedPage.nomor_lembar}`}
              onPrev={handlePrev}
              onNext={handleNext}
              hasPrev={hasPrev}
              hasNext={hasNext}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="text-6xl mb-4 opacity-20">📜</div>
              <p className="text-sm font-medium">Pilih lembar dari panel kiri</p>
            </div>
          )}
        </div>

        {/* Panel Kanan: Info & Audio */}
        <div className="w-72 xl:w-80 flex-shrink-0 bg-white border-l border-gray-100 overflow-y-auto">
          <InfoPanel />
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE / TABLET LAYOUT (below lg)
          Vertical stack: strip → image → info → audio
      ══════════════════════════════════════ */}
      <div className="lg:hidden flex flex-col pb-10">

        {/* 1. Daftar Lembar – horizontal scrollable thumbnail strip */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-unesco-blue" />
                Daftar Lembar
              </h2>
              <span className="text-[10px] text-gray-400">{pages.length} halaman</span>
            </div>
          </div>
          {pages.length > 0 ? (
            <div className="lembar-strip px-3 py-2">
              {pages.map((page) => (
                <LembarThumb key={page.id} page={page} compact={true} />
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              Belum ada lembar untuk naskah ini.
            </div>
          )}
        </div>

        {/* 2. Foto Lembar – full width, aspect-ratio-based height */}
        <div className="bg-gray-900/5 border-b border-gray-200">
          {selectedPage ? (
            <div className="w-full" style={{ minHeight: '280px' }}>
              <ImageViewer
                foto={selectedPage.foto_enhanced || selectedPage.foto_halaman}
                judul={selectedPage.judul_halaman || `Lembar ${selectedPage.nomor_lembar}`}
                onPrev={handlePrev}
                onNext={handleNext}
                hasPrev={hasPrev}
                hasNext={hasNext}
                mobileMode={true}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 py-16">
              <div className="text-6xl mb-4 opacity-20">📜</div>
              <p className="text-sm font-medium">Pilih lembar dari daftar di atas</p>
            </div>
          )}
        </div>

        {/* 3. Informasi Lembar + 4. Audio – card below photo */}
        <div className="bg-white rounded-b-2xl shadow-sm mx-3 mt-3 border border-gray-100 mb-4">
          <InfoPanel />
        </div>
      </div>
    </div>
  );
};

export default ManuscriptDetail;
