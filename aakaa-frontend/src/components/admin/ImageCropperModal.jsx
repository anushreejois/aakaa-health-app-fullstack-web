import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Check, Move, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

const ImageCropperModal = ({ isOpen, imageSrc, onClose, onCropComplete }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 });

  const imageRef = useRef(null);

  // Target crop frame dimensions (3:4 ratio for professional portrait)
  const CROP_WIDTH = 285;
  const CROP_HEIGHT = 380;
  const OUTPUT_WIDTH = 600;
  const OUTPUT_HEIGHT = 800;

  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      const img = new Image();
      img.onload = () => {
        setImgNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  // Compute cover size inside the CROP_WIDTH x CROP_HEIGHT box at zoom=1
  const coverScale = (imgNaturalSize.width && imgNaturalSize.height)
    ? Math.max(CROP_WIDTH / imgNaturalSize.width, CROP_HEIGHT / imgNaturalSize.height)
    : 1;

  const baseWidth = imgNaturalSize.width ? imgNaturalSize.width * coverScale : CROP_WIDTH;
  const baseHeight = imgNaturalSize.height ? imgNaturalSize.height * coverScale : CROP_HEIGHT;

  const currentDisplayWidth = baseWidth * zoom;
  const currentDisplayHeight = baseHeight * zoom;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(3.5, Math.max(1, prev + delta)));
  };

  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = OUTPUT_WIDTH;
    outputCanvas.height = OUTPUT_HEIGHT;
    const ctx = outputCanvas.getContext('2d');

    // Solid white clinical canvas base
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

    // Export scale factor from on-screen crop box to canvas
    const exportScale = OUTPUT_WIDTH / CROP_WIDTH;

    // Center of canvas
    const canvasCenterX = OUTPUT_WIDTH / 2 + position.x * exportScale;
    const canvasCenterY = OUTPUT_HEIGHT / 2 + position.y * exportScale;

    const drawWidth = currentDisplayWidth * exportScale;
    const drawHeight = currentDisplayHeight * exportScale;

    ctx.drawImage(
      img,
      canvasCenterX - drawWidth / 2,
      canvasCenterY - drawHeight / 2,
      drawWidth,
      drawHeight
    );

    const croppedDataUrl = outputCanvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#18231c] border border-white/10 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Frame Practitioner Portrait</h3>
            <p className="text-xs text-aakaa-gold font-medium mt-0.5">Drag photo to center the face, zoom to adjust framing</p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cropper Viewport */}
        <div 
          className="relative w-full h-[460px] bg-black/70 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onWheel={handleWheel}
        >
          {/* Draggable & Scaled Image */}
          {imgNaturalSize.width > 0 && (
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop Target"
              draggable={false}
              style={{
                width: `${currentDisplayWidth}px`,
                height: `${currentDisplayHeight}px`,
                transform: `translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center center',
                pointerEvents: 'none',
                maxWidth: 'none',
                maxHeight: 'none'
              }}
            />
          )}

          {/* Dark Overlay with 3:4 Crop Window */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div 
              style={{
                width: `${CROP_WIDTH}px`,
                height: `${CROP_HEIGHT}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.72)'
              }}
              className="border-2 border-white rounded-2xl relative shadow-2xl"
            >
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-aakaa-gold" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-aakaa-gold" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-aakaa-gold" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-aakaa-gold" />

              {/* Subdued Rule-of-Thirds Grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-white/80 font-bold flex items-center gap-1.5 pointer-events-none border border-white/10">
            <Move size={12} className="text-aakaa-gold" /> Drag to align face inside frame
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-6 bg-[#131c16] border-t border-white/10 flex flex-col gap-5">
          {/* Zoom Slider */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setZoom(prev => Math.max(1, prev - 0.2))}
              className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              <ZoomOut size={18} />
            </button>
            <input
              type="range"
              min="1"
              max="3.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-aakaa-gold h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom(prev => Math.min(3.5, prev + 0.2))}
              className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              <ZoomIn size={18} />
            </button>
            <button
              type="button"
              onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }); }}
              className="px-3 py-1.5 text-[11px] font-bold text-aakaa-gold/90 hover:text-aakaa-gold bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              className="px-8 py-3.5 bg-aakaa-green text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-aakaa-green/90 transition-all shadow-xl shadow-aakaa-green/20 flex items-center gap-2"
            >
              <Check size={16} /> Save Cropped Portrait
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default ImageCropperModal;
