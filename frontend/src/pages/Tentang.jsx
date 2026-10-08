import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NaskahCard from '../components/NaskahCard';

const ISI_CARDS = [
  { icon: '⚔️', title: 'Sejarah', desc: 'Catatan dan cerita mengenai masa lalu serta asal-usul suatu daerah, kerajaan, dan tokoh masyarakat.' },
  { icon: '🎎', title: 'Cerita & Budaya', desc: 'Cerita rakyat, tradisi, nilai kehidupan, dan adat istiadat masyarakat Sasak yang diwariskan turun-temurun.' },
  { icon: '🌿', title: 'Pengetahuan', desc: 'Ilmu pengetahuan, ramuan pengobatan, dan kearifan lokal yang diwariskan oleh masyarakat terdahulu.' },
];

const ALASAN_CARDS = [
  { no: '01', icon: '💾', title: 'Dilestarikan', desc: 'Informasi naskah dapat disimpan dalam bentuk digital sehingga tidak hilang akibat kerusakan fisik.' },
  { no: '02', icon: '🔬', title: 'Dipelajari', desc: 'Masyarakat dan peneliti dapat melihat dan mempelajari naskah dengan lebih mudah, dari mana saja.' },
  { no: '03', icon: '🌍', title: 'Dikenalkan', desc: 'Warisan budaya Sasak dapat diperkenalkan kepada generasi berikutnya dan masyarakat yang lebih luas.' },
];

const Tentang = () => {
  const [lontars, setLontars] = useState([]);
  const [totalNaskah, setTotalNaskah] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/lontars');
        const data = Array.isArray(res.data) ? res.data : [];
        setTotalNaskah(data.length);
        setLontars(data.slice(0, 3));
      } catch {
        setLontars([]);
        setTotalNaskah(0);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="bg-background">

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[65vh] sm:min-h-[88vh] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/Lontar dan kalendernya.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-28 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold tracking-widest uppercase mb-6 border border-white/25">
              🏛 UNESCO Global Geopark Rinjani
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight drop-shadow-sm">
              Naskah Lontar<br />
              <span className="text-blue-300">Sasak Digital</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-8 sm:mb-10 max-w-xl leading-relaxed">
              Mengenal, menjaga, dan memperkenalkan warisan budaya Sasak melalui dokumentasi digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/koleksi"
                className="inline-flex items-center justify-center bg-white text-unesco-blue hover:bg-blue-50 font-bold px-8 py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Jelajahi Koleksi Lontar
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#apa-itu-lontar"
                className="inline-flex items-center justify-center bg-transparent border border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════
          APA ITU LONTAR SASAK?
      ══════════════════════════════════════════ */}
      <section id="apa-itu-lontar" className="bg-white py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Teks */}
            <div>
              <span className="inline-block text-[11px] font-bold text-heritage-brown uppercase tracking-widest mb-4 border-b-2 border-heritage-brown pb-1">
                Warisan Nusantara
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                Apa Itu<br />Lontar Sasak?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Lontar Sasak adalah naskah tradisional yang ditulis pada lembaran daun lontar dan menjadi salah satu bagian dari warisan budaya masyarakat Sasak di Lombok. Naskah-naskah ini menyimpan berbagai cerita, pengetahuan, sejarah, dan nilai kehidupan yang diwariskan dari generasi ke generasi.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Setiap naskah lontar merupakan karya tulis yang unik — ditulis dengan aksara Jejawan (Hanacaraka Sasak) menggunakan alat tajam bernama <em>pengutik</em>, kemudian dihitamkan untuk memperjelas tulisan. Setiap lembar menyimpan makna yang mendalam tentang kehidupan dan peradaban masyarakat Lombok masa lampau.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/koleksi"
                  className="inline-flex items-center bg-unesco-blue text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-sm"
                >
                  Lihat Koleksi
                </Link>
              </div>
            </div>

            {/* Foto / Ilustrasi */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center border border-amber-200">
                <div className="text-8xl opacity-80 drop-shadow-md">📜</div>
              </div>
              {/* Badge info */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg border border-gray-100 p-4 hidden md:block">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Koleksi Digital</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {loading ? '...' : totalNaskah}
                </p>
                <p className="text-xs text-gray-500">naskah terdokumentasi</p>
              </div>
              {/* Accent dot */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-50 rounded-full opacity-60" />
              <div className="absolute top-4 right-4 w-8 h-8 bg-heritage-brown/20 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          APA YANG TERSIMPAN DI DALAM LONTAR?
      ══════════════════════════════════════════ */}
      <section className="bg-background py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] font-bold text-heritage-brown uppercase tracking-widest mb-3">
              Isi Naskah
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Apa yang Tersimpan di Dalam Lontar?
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Lontar bukan sekadar tulisan kuno. Di dalamnya tersimpan kekayaan intelektual dan spiritual masyarakat Sasak.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ISI_CARDS.map((c) => (
              <div key={c.title} className="museum-card p-8 text-center hover:border-blue-100 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{c.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MENGAPA PERLU DIDIGITALISASI?
      ══════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Judul & deskripsi */}
            <div>
              <span className="inline-block text-[11px] font-bold text-heritage-brown uppercase tracking-widest mb-4">
                Urgensi Pelestarian
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                Mengapa Lontar Perlu<br />
                <span className="text-unesco-blue">Didigitalisasi?</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Lontar merupakan warisan budaya yang rapuh. Kondisi fisiknya dapat mengalami kerusakan akibat usia, kelembapan, dan lingkungan. Banyak naskah yang sudah tidak dapat dibaca karena kondisinya semakin memburuk dari tahun ke tahun.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Digitalisasi adalah langkah nyata untuk memastikan bahwa pengetahuan yang tersimpan di dalamnya tidak hilang selamanya.
              </p>
            </div>

            {/* 3 Poin */}
            <div className="space-y-5">
              {ALASAN_CARDS.map((a) => (
                <div key={a.no} className="flex items-start gap-5 p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
                  <div className="w-12 h-12 bg-unesco-blue text-white rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 shadow-sm">
                    {a.no}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{a.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BAGAIMANA PLATFORM INI BEKERJA?
      ══════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-unesco-blue to-blue-900 py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-4">
              Platform Digital
            </span>
            <h2 className="text-3xl font-extrabold text-white mb-6">
              Bagaimana Platform Ini Bekerja?
            </h2>
            <p className="text-blue-100 leading-relaxed mb-10">
              Platform ini menyediakan dokumentasi digital naskah lontar Sasak secara terstruktur. Setiap naskah dapat memiliki banyak lembar yang dilengkapi foto beresolusi tinggi, penjelasan isi halaman, serta rekaman pembacaan oleh ahli.
            </p>

            {/* Struktur visual – wraps on mobile */}
            <div className="flex items-center justify-center gap-y-2 flex-wrap">
              {['📚 Naskah', '📄 Lembar', '🖼 Foto', '📝 Penjelasan', '🎧 Audio'].map((item, i, arr) => (
                <div key={item} className="flex items-center">
                  <div className="bg-white/15 backdrop-blur border border-white/20 text-white text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                    {item}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="text-blue-300 mx-1.5 sm:mx-2 font-bold">→</div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-blue-200 text-sm mt-8">
              Admin Geopark Rinjani dapat terus menambahkan naskah, lembar, foto, dan rekaman baru tanpa perlu mengubah struktur website.
            </p>

            <div className="mt-8">
              <Link
                to="/koleksi"
                className="inline-flex items-center bg-white text-unesco-blue font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Jelajahi Koleksi Lontar →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          KOLEKSI TERBARU
      ══════════════════════════════════════════ */}
      <section className="bg-background py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block text-[11px] font-bold text-heritage-brown uppercase tracking-widest mb-3">
                Koleksi Digital
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900">Naskah Lontar Terbaru</h2>
            </div>
            <Link
              to="/koleksi"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-unesco-blue hover:underline"
            >
              Lihat Semua Koleksi →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="museum-card h-72 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : lontars.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4 opacity-30">📜</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada koleksi naskah</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Data naskah lontar akan ditampilkan setelah admin menambahkan koleksi naskah asli melalui Dashboard Admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lontars.map((n) => (
                <NaskahCard key={n.id} naskah={n} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/koleksi"
              className="inline-flex items-center bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-3.5 rounded-xl hover:border-unesco-blue hover:text-unesco-blue transition-all duration-200 shadow-sm"
            >
              Lihat Semua Naskah Lontar
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Tentang;
