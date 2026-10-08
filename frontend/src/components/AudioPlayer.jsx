import { useRef, useState, useEffect } from 'react';

/**
 * AudioPlayer – pemutar audio modern per lembar lontar.
 * Props:
 *   src           – URL file audio
 *   namaPembaca   – nama pembaca
 *   verified      – boolean, apakah pembacaan sudah diverifikasi ahli
 */
const AudioPlayer = ({ src, namaPembaca, verified }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset saat src berubah
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Support both mouse click and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = (clientX - rect.left) / rect.width;
    audioRef.current.currentTime = Math.max(0, Math.min(ratio * duration, duration));
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  if (!src) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-dashed border-gray-200 text-center">
        <div className="text-2xl mb-1 opacity-30">🎧</div>
        <p className="text-xs text-gray-400">Audio pembacaan belum tersedia untuk lembar ini</p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-unesco-blue rounded-full flex items-center justify-center text-white text-sm">
            🎧
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Audio Pembacaan</p>
            {namaPembaca && (
              <p className="text-[10px] text-gray-500">oleh {namaPembaca}</p>
            )}
          </div>
        </div>
        {verified && (
          <span className="flex items-center gap-1 text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            ✓ Terverifikasi Ahli
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-11 h-11 sm:w-10 sm:h-10 bg-unesco-blue hover:bg-blue-800 text-white rounded-full flex items-center justify-center shadow-sm transition-colors flex-shrink-0 no-min-height"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Progress */}
        <div className="flex-1">
          {/* Bar – tap/click to seek */}
          <div
            className="h-2.5 sm:h-2 bg-blue-200 rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleSeek}
            onTouchStart={handleSeek}
            style={{ touchAction: 'none' }}
          >
            <div
              className="absolute left-0 top-0 h-full bg-unesco-blue rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Time */}
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-500">{fmt(currentTime)}</span>
            <span className="text-[10px] text-gray-400">{fmt(duration)}</span>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
      />
    </div>
  );
};

export default AudioPlayer;
