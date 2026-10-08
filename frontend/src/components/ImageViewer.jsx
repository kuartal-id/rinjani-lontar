import { useState, useRef, useEffect } from 'react';

/**
 * ImageViewer – komponen foto lontar dengan zoom, pan, dan fullscreen.
 * Props:
 *   foto       – URL foto yang ditampilkan
 *   judul      – judul untuk alt text dan label fullscreen
 *   onPrev     – fungsi untuk pindah ke lembar sebelumnya
 *   onNext     – fungsi untuk pindah ke lembar berikutnya
 *   hasPrev    – boolean
 *   hasNext    – boolean
 *   mobileMode – boolean: ketika true, viewer tidak menggunakan height:100% melainkan
 *                aspect-ratio-based agar tidak collapse di layout vertikal mobile
 */
const ImageViewer = ({ foto, judul, onPrev, onNext, hasPrev, hasNext, mobileMode = false }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Touch state for pinch-zoom
  const lastTouchDist = useRef(null);
  const lastTouchPos = useRef(null);

  // Reset posisi dan zoom saat foto berganti
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [foto]);

  // Tutup fullscreen saat Escape ditekan
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const zoomIn  = () => setScale(s => Math.min(parseFloat((s + 0.25).toFixed(2)), 4));
  const zoomOut = () => setScale(s => Math.max(parseFloat((s - 0.25).toFixed(2)), 0.5));
  const reset   = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

  // ── Mouse events (desktop) ──
  const onMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };
  const onMouseMove = (e) => {
    if (isDragging) setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => setIsDragging(false);

  // Wheel zoom (desktop)
  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale(s => Math.min(Math.max(parseFloat((s + delta).toFixed(2)), 0.5), 4));
  };

  // ── Touch events (mobile) ──
  const getTouchDist = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 1 && scale > 1) {
      // Single-finger drag when zoomed in
      lastTouchPos.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      // Pinch start
      lastTouchDist.current = getTouchDist(e.touches);
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault(); // prevent page scroll while interacting with image
    if (e.touches.length === 1 && isDragging && scale > 1 && lastTouchPos.current) {
      setPosition({
        x: e.touches[0].clientX - lastTouchPos.current.x,
        y: e.touches[0].clientY - lastTouchPos.current.y,
      });
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const newDist = getTouchDist(e.touches);
      const ratio = newDist / lastTouchDist.current;
      setScale(s => Math.min(Math.max(parseFloat((s * ratio).toFixed(2)), 0.5), 4));
      lastTouchDist.current = newDist;
    }
  };

  const onTouchEnd = (e) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      lastTouchPos.current = null;
      lastTouchDist.current = null;
    } else if (e.touches.length === 1) {
      lastTouchDist.current = null;
    }
  };

  const imageStyle = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    userSelect: 'none',
    maxWidth: isFullscreen ? '100%' : (mobileMode ? '95%' : '75%'),
    maxHeight: isFullscreen ? '100%' : (mobileMode ? '95%' : '75%'),
    objectFit: 'contain',
  };

  const toolbar = (dark = false) => (
    <div className={`flex items-center justify-between px-3 py-2 ${dark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50/80 border-gray-100'} border-b flex-shrink-0`}>
      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={zoomOut}
          className={`w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded text-sm font-bold ${dark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'} transition-colors no-min-height`}
          title="Zoom Out"
        >−</button>
        <span className={`text-[11px] font-semibold w-12 text-center ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={zoomIn}
          className={`w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded text-sm font-bold ${dark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'} transition-colors no-min-height`}
          title="Zoom In"
        >+</button>
        <button
          onClick={reset}
          className={`ml-1 px-2 py-1 text-[10px] font-medium rounded ${dark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'} transition-colors no-min-height`}
        >Reset</button>
      </div>

      {/* Navigation + Fullscreen */}
      <div className="flex items-center gap-1.5">
        {onPrev && (
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`px-2 py-1.5 text-[10px] sm:text-[11px] font-semibold rounded transition-colors disabled:opacity-30 no-min-height ${dark ? 'text-gray-300 hover:bg-gray-700 disabled:hover:bg-transparent' : 'text-gray-600 hover:bg-gray-200 disabled:hover:bg-transparent'}`}
          >← Sblm</button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`px-2 py-1.5 text-[10px] sm:text-[11px] font-semibold rounded transition-colors disabled:opacity-30 no-min-height ${dark ? 'text-gray-300 hover:bg-gray-700 disabled:hover:bg-transparent' : 'text-gray-600 hover:bg-gray-200 disabled:hover:bg-transparent'}`}
          >Brtkt →</button>
        )}
        <button
          onClick={() => { setIsFullscreen(f => !f); reset(); }}
          className={`w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded text-sm no-min-height ${dark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'} transition-colors`}
          title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? '✕' : '⛶'}
        </button>
      </div>
    </div>
  );

  const imageArea = (dark = false) => (
    <div
      className={`flex-1 overflow-hidden flex items-center justify-center select-none ${dark ? 'bg-black' : 'bg-gray-800/5'}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'zoom-in'), touchAction: 'none' }}
    >
      {foto ? (
        <img
          src={foto}
          alt={judul || 'Foto Lembar'}
          style={imageStyle}
          draggable={false}
          className="rounded"
        />
      ) : (
        <div className="text-center text-gray-400 px-8">
          <div className="text-6xl mb-4 opacity-20">📜</div>
          <p className="text-sm font-medium">Belum ada foto untuk lembar ini</p>
          <p className="text-xs mt-1 opacity-70">Admin dapat mengupload foto melalui dashboard</p>
        </div>
      )}
    </div>
  );

  /* ── Fullscreen Overlay ── */
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {toolbar(true)}
        {imageArea(true)}
      </div>
    );
  }

  /* ── Mobile Mode: fixed height container so image area is visible ── */
  if (mobileMode) {
    return (
      <div className="flex flex-col" style={{ height: '300px' }}>
        {toolbar(false)}
        {imageArea(false)}
      </div>
    );
  }

  /* ── Normal Desktop Mode ── */
  return (
    <div className="flex flex-col h-full">
      {toolbar(false)}
      {imageArea(false)}
    </div>
  );
};

export default ImageViewer;
