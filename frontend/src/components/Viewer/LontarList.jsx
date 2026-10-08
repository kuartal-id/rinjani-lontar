import React, { useState } from 'react';
import { FiSearch, FiFilter, FiBookOpen } from 'react-icons/fi';

const LontarList = ({ lontars, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Semua');

  const categories = [
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

  const filteredLontars = lontars.filter(l => {
    const matchesSearch = 
      l.nomor_lembar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.lokasi && l.lokasi.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesFilter = filter === 'Semua' || l.kategori === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-600';
    if (status.toLowerCase().includes('baik')) return 'bg-green-50 text-green-700 border-green-200';
    if (status.toLowerCase().includes('perawatan')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="w-full md:w-1/2 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 w-5 h-5" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-unesco-blue focus:border-unesco-blue focus:bg-white smooth-transition sm:text-sm"
            placeholder="Cari berdasarkan judul, nomor lembar, atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-1/4 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiFilter className="text-gray-400 w-5 h-5" />
          </div>
          <select
            className="block w-full pl-11 pr-10 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-unesco-blue focus:border-unesco-blue focus:bg-white smooth-transition sm:text-sm appearance-none cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="flex-1 w-full">
        {filteredLontars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLontars.map(lontar => (
              <div 
                key={lontar.id}
                className="museum-card flex flex-col group overflow-hidden cursor-pointer"
                onClick={() => onSelect(lontar)}
              >
                {/* Photo Thumbnail */}
                <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                  {lontar.foto ? (
                    <img 
                      src={lontar.foto} 
                      alt={lontar.judul} 
                      className="w-full h-full object-cover group-hover:scale-105 smooth-transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      <FiBookOpen className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                  {/* Category Badge over Image */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
                    {lontar.kategori}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs text-unesco-blue font-semibold tracking-widest mb-2 uppercase">
                    {lontar.nomor_lembar}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-unesco-blue transition-colors">
                    {lontar.judul}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                    {lontar.ringkasan || 'Tidak ada ringkasan.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(lontar.kondisi)}`}>
                      {lontar.kondisi || 'Tidak Diketahui'}
                    </span>
                    <button 
                      className="text-unesco-blue text-sm font-semibold flex items-center opacity-80 group-hover:opacity-100 group-hover:translate-x-1 smooth-transition"
                    >
                      Lihat Lembar
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <FiSearch className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Tidak ada lontar yang sesuai</h3>
            <p className="mt-1 text-gray-500 text-sm">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LontarList;
