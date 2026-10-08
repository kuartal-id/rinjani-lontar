import React from 'react';

const LontarInfo = ({ lontar }) => {
  if (!lontar) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
        <svg className="w-20 h-20 mb-6 opacity-20 text-unesco-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        <p className="text-sm font-medium tracking-wide">Pilih naskah untuk melihat detail.</p>
      </div>
    );
  }

  const InfoRow = ({ label, value }) => (
    <div className="mb-5 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</dt>
      <dd className="text-sm font-medium text-gray-800">{value || '-'}</dd>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Top Header Label */}
      <div className="px-8 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 flex justify-between items-center">
        <span className="text-xs font-bold text-unesco-blue uppercase tracking-widest flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Informasi Naskah
        </span>
        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider">
          {lontar.nomor_lembar}
        </span>
      </div>
      
      <div className="p-8 overflow-y-auto flex-1">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{lontar.judul}</h2>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
              {lontar.kategori}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {lontar.lokasi}
            </span>
          </div>
        </div>
        
        <dl className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 mb-8">
          <div className="grid grid-cols-2 gap-x-6">
            <InfoRow label="Perkiraan Tahun" value={lontar.tahun} />
            <InfoRow label="Bahasa" value={lontar.bahasa || 'Sasak'} />
            <InfoRow label="Jumlah Halaman" value={lontar.jumlah_halaman ? `${lontar.jumlah_halaman} Halaman` : null} />
            <InfoRow label="Kondisi" value={lontar.kondisi} />
          </div>
        </dl>
          
        <div className="mb-8">
          <dt className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center border-b border-gray-100 pb-2">
            Ringkasan Isi
          </dt>
          <dd className="text-[15px] text-gray-600 leading-relaxed text-justify">
            {lontar.ringkasan || 'Tidak ada ringkasan yang tersedia untuk naskah ini.'}
          </dd>
        </div>

        {/* Bagian Audio — selalu tampil */}
        <div className="mt-8">
          <dt className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center border-b border-gray-100 pb-2">
            <span className="text-lg mr-2">🎧</span> Audio Pembacaan
          </dt>

          {lontar.audio ? (
            /* Ada audio — tampilkan player */
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="mb-4">
                <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">
                  Dibacakan oleh
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {lontar.audio.reader_name}
                </div>
                {lontar.audio.verified && (
                  <div className="text-[11px] text-green-700 font-semibold mt-1.5 flex items-center bg-green-50 w-max px-2.5 py-0.5 rounded-full border border-green-100">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Telah diverifikasi oleh ahli
                  </div>
                )}
              </div>
              <audio controls className="w-full rounded-lg">
                <source src={lontar.audio.url} type="audio/mpeg" />
                Browser Anda tidak mendukung elemen audio.
              </audio>
            </div>
          ) : (
            /* Belum ada audio — tampilkan placeholder informatif */
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center bg-gray-50/50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Belum ada audio pembacaan</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Audio pembacaan untuk lembar ini belum tersedia. Admin dapat menambahkan melalui dashboard.
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">SUMBER: KOLEKSI GEOPARK RINJANI</p>
        </div>
      </div>
    </div>
  );
};

export default LontarInfo;
