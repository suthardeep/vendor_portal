import React, { useState, useRef, useEffect } from 'react';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface ColorData {
  color: string;
  name: string;
  alpha: number;
  rgb: RGB;
  hsl: HSL;
}

interface CustomColorPickerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (color: ColorData) => void;
  initialColor?: string;
  initialName?: string;
  title?: string;
  showHex?: boolean;
  showRGB?: boolean;
  showHSL?: boolean;
  showHSB?: boolean;
  cancelText?: string;
  saveText?: string;
  maxWidth?: string;
  pickerHeight?: string;
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({
  isOpen = true,
  onClose = () => {},
  onSave = (color: ColorData) => console.log('Color saved:', color),
  initialColor = '#8000ff',
  initialName = 'Custom blue',
  title = 'Custom Colour',
  showHex = true,
  showRGB = true,
  showHSL = true,
  showHSB = true,
  cancelText = 'Cancel',
  saveText = 'Create',
  maxWidth = '500px',
  pickerHeight = '200px'
}) => {
  const [color, setColor] = useState<string>(initialColor);
  const [colorName, setColorName] = useState<string>(initialName);
  const [colorMode, setColorMode] = useState<'Hex' | 'RGB' | 'HSL' | 'HSB'>('Hex');
  const [isDraggingSaturation, setIsDraggingSaturation] = useState<boolean>(false);
  const [isDraggingHue, setIsDraggingHue] = useState<boolean>(false);
  const [isDraggingAlpha, setIsDraggingAlpha] = useState<boolean>(false);
  
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  // Convert hex to RGB
  const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): HSL => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h: number, s: number, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
        default: h = 0;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): RGB => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(100);
  const [lightness, setLightness] = useState<number>(50);
  const [alpha, setAlpha] = useState<number>(100);

  useEffect(() => {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
  }, [color]);

  const handleSaturationClick = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!saturationRef.current) return;
    const rect = saturationRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    
    const newSat = (x / rect.width) * 100;
    const newLight = 100 - (y / rect.height) * 100;
    
    setSaturation(newSat);
    setLightness(newLight);
    
    const rgb = hslToRgb(hue, newSat, newLight);
    setColor(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const handleHueClick = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newHue = (x / rect.width) * 360;
    
    setHue(newHue);
    const rgb = hslToRgb(newHue, saturation, lightness);
    setColor(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const handleAlphaClick = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!alphaRef.current) return;
    const rect = alphaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newAlpha = (x / rect.width) * 100;
    setAlpha(newAlpha);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSaturation) handleSaturationClick(e);
      if (isDraggingHue) handleHueClick(e);
      if (isDraggingAlpha) handleAlphaClick(e);
    };

    const handleMouseUp = () => {
      setIsDraggingSaturation(false);
      setIsDraggingHue(false);
      setIsDraggingAlpha(false);
    };

    if (isDraggingSaturation || isDraggingHue || isDraggingAlpha) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSaturation, isDraggingHue, isDraggingAlpha, hue, saturation, lightness]);

  const handleSave = () => {
    const rgb = hexToRgb(color);
    onSave({ color, name: colorName, alpha, rgb, hsl: rgbToHsl(rgb.r, rgb.g, rgb.b) });
  };

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ maxWidth }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white rounded-t-xl z-10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none w-6 h-6 flex items-center justify-center">×</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Saturation/Lightness Picker */}
          <div
            ref={saturationRef}
            className="relative w-full rounded-lg cursor-crosshair overflow-hidden"
            style={{
              height: pickerHeight,
              background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`
            }}
            onMouseDown={(e) => {
              setIsDraggingSaturation(true);
              handleSaturationClick(e);
            }}
          >
            <div
              className="absolute w-5 h-5 border-3 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`
              }}
            />
          </div>

          {/* Hue Slider */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md border-2 border-gray-200 shrink-0" style={{ backgroundColor: color }} />
            <div
              ref={hueRef}
              className="relative flex-1 h-8 rounded-md cursor-pointer overflow-hidden"
              style={{
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
              }}
              onMouseDown={(e) => {
                setIsDraggingHue(true);
                handleHueClick(e);
              }}
            />
            <div className="w-8 h-8 rounded-md shrink-0" style={{ backgroundColor: '#ff0066' }} />
          </div>

          {/* Alpha Slider */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-linear-to-br from-gray-200 to-gray-300 shrink-0" />
            <div
              ref={alphaRef}
              className="relative flex-1 h-8 rounded-md cursor-pointer overflow-hidden"
              style={{
                background: `linear-gradient(to right, rgba(128, 128, 128, 0.2), ${color})`
              }}
              onMouseDown={(e) => {
                setIsDraggingAlpha(true);
                handleAlphaClick(e);
              }}
            >
              <div
                className="absolute top-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full transform -translate-y-1/2 shadow-md pointer-events-none"
                style={{ left: `calc(${alpha}% - 6px)` }}
              />
            </div>
            <div className="w-8 h-8 rounded-md shrink-0" style={{ backgroundColor: color }} />
          </div>

          {/* Color Mode Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {showHex && <button onClick={() => setColorMode('Hex')} className={`flex-1 py-1.5 text-sm rounded-md transition ${colorMode === 'Hex' ? 'bg-white shadow' : ''}`}>Hex</button>}
            {showRGB && <button onClick={() => setColorMode('RGB')} className={`flex-1 py-1.5 text-sm rounded-md transition ${colorMode === 'RGB' ? 'bg-white shadow' : ''}`}>RGB</button>}
            {showHSL && <button onClick={() => setColorMode('HSL')} className={`flex-1 py-1.5 text-sm rounded-md transition ${colorMode === 'HSL' ? 'bg-white shadow' : ''}`}>HSL</button>}
            {showHSB && <button onClick={() => setColorMode('HSB')} className={`flex-1 py-1.5 text-sm rounded-md transition ${colorMode === 'HSB' ? 'bg-white shadow' : ''}`}>HSB</button>}
          </div>

          {/* Color Value Input */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2.5">
            <span className="text-gray-500 text-lg">🎨</span>
            <span className="text-gray-500 text-sm">#</span>
            <input
              type="text"
              value={colorMode === 'Hex' ? color.replace('#', '') : colorMode === 'RGB' ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : `${hsl.h}, ${hsl.s}%, ${hsl.l}%`}
              onChange={(e) => {
                if (colorMode === 'Hex') {
                  const val = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                  if (val.length <= 6) setColor('#' + val);
                }
              }}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <span className="text-gray-500 text-sm">{Math.round(alpha)}</span>
            <span className="text-gray-500 text-sm">%</span>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Name</label>
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              {cancelText}
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              {saveText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomColorPicker;

// Demo Usage
export function CustomColorPickerDemo() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [savedColor, setSavedColor] = useState<ColorData | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Custom Color Picker Demo</h1>
        
        <div className="space-y-4 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Different Sizes:</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                Default (500px × 200px)
              </button>
            </div>
          </div>
        </div>

        {savedColor && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Saved Color:</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg border" style={{ backgroundColor: savedColor.color }} />
              <div>
                <p className="font-medium">{savedColor.name}</p>
                <p className="text-sm text-gray-600">Hex: {savedColor.color}</p>
                <p className="text-sm text-gray-600">RGB: {savedColor.rgb.r}, {savedColor.rgb.g}, {savedColor.rgb.b}</p>
                <p className="text-sm text-gray-600">Alpha: {Math.round(savedColor.alpha)}%</p>
              </div>
            </div>
          </div>
        )}

        <CustomColorPicker
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={(color) => {
            setSavedColor(color);
            setIsOpen(false);
          }}
          initialColor="#8000ff"
          initialName="Custom blue"
          maxWidth="500px"
          pickerHeight="200px"
        />
      </div>
    </div>
  );
}