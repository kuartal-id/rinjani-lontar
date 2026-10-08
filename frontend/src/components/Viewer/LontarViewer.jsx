import React, { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { FiZoomIn, FiZoomOut, FiMaximize, FiHome } from 'react-icons/fi';

const LontarViewer = ({ foto }) => {
  const viewerRef = useRef(null);
  const osdInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!foto || !viewerRef.current) return;

    setIsLoading(true);

    if (osdInstance.current) {
      osdInstance.current.destroy();
    }

    osdInstance.current = OpenSeadragon({
      element: viewerRef.current,
      prefixUrl: '//openseadragon.github.io/openseadragon/images/',
      tileSources: {
        type: 'image',
        url: foto
      },
      animationTime: 0.8,
      blendTime: 0.3,
      constrainDuringPan: true,
      maxZoomPixelRatio: 2,
      minZoomImageRatio: 0.8,
      visibilityRatio: 1,
      zoomPerScroll: 1.2,
      showNavigationControl: false,
      showNavigator: true,
      navigatorPosition: "TOP_RIGHT",
      navigatorSizeRatio: 0.15,
      navigatorAutoFade: true,
    });

    osdInstance.current.addHandler('open', () => {
      setIsLoading(false);
    });

    osdInstance.current.addHandler('open-failed', () => {
      setIsLoading(false);
      console.error("Failed to load image for OpenSeadragon");
    });

    return () => {
      if (osdInstance.current) {
        osdInstance.current.destroy();
      }
    };
  }, [foto]);

  const handleZoomIn = () => {
    if (osdInstance.current) {
      osdInstance.current.viewport.zoomBy(1.2);
      osdInstance.current.viewport.applyConstraints();
    }
  };

  const handleZoomOut = () => {
    if (osdInstance.current) {
      osdInstance.current.viewport.zoomBy(0.8);
      osdInstance.current.viewport.applyConstraints();
    }
  };

  const handleFitScreen = () => {
    if (osdInstance.current) {
      osdInstance.current.viewport.goHome();
    }
  };

  const handleFullScreen = () => {
    if (osdInstance.current) {
      osdInstance.current.setFullScreen(true);
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-[#eef2f6] relative group overflow-hidden rounded-t-2xl">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-sm">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-unesco-blue/20"></div>
            <div className="w-12 h-12 rounded-full border-2 border-unesco-blue border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      )}
      
      {/* Container for OpenSeadragon */}
      <div ref={viewerRef} className="w-full h-full cursor-grab active:cursor-grabbing"></div>

      {/* Modern Toolbar */}
      <div className="absolute top-6 left-6 flex flex-col gap-3 z-10 opacity-0 group-hover:opacity-100 smooth-transition translate-x-[-10px] group-hover:translate-x-0">
        <button onClick={handleZoomIn} className="bg-white/80 backdrop-blur shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-3 rounded-xl text-gray-700 hover:text-unesco-blue hover:bg-white smooth-transition hover:scale-105" title="Perbesar">
          <FiZoomIn size={22} />
        </button>
        <button onClick={handleZoomOut} className="bg-white/80 backdrop-blur shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-3 rounded-xl text-gray-700 hover:text-unesco-blue hover:bg-white smooth-transition hover:scale-105" title="Perkecil">
          <FiZoomOut size={22} />
        </button>
        <button onClick={handleFitScreen} className="bg-white/80 backdrop-blur shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-3 rounded-xl text-gray-700 hover:text-unesco-blue hover:bg-white smooth-transition hover:scale-105" title="Fit Screen">
          <FiHome size={22} />
        </button>
        <div className="w-full h-[1px] bg-gray-300/50 my-1"></div>
        <button onClick={handleFullScreen} className="bg-white/80 backdrop-blur shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-3 rounded-xl text-gray-700 hover:text-unesco-blue hover:bg-white smooth-transition hover:scale-105" title="Fullscreen">
          <FiMaximize size={22} />
        </button>
      </div>
    </div>
  );
};

export default LontarViewer;
