import React, { useState, useEffect } from 'react';

interface ClothPreviewProps {
  type?: 'tee' | 'hoodie' | 'rack' | string;
  color?: string;
  hasLogo?: boolean | number | string;
  img?: string;
  className?: string;
  alt?: string;
}

export const ClothPreview: React.FC<ClothPreviewProps> = ({
  type = 'tee',
  color = '#d9c3ad',
  hasLogo = false,
  img,
  className = '',
  alt = 'VYOMIK garment preview',
}) => {
  const [imgError, setImgError] = useState(false);

  // Normalize image source path
  let imgSrc = img;
  if (imgSrc && !imgSrc.startsWith('/') && !imgSrc.startsWith('http')) {
    imgSrc = `/${imgSrc}`;
  }

  useEffect(() => {
    setImgError(false);
  }, [imgSrc, color, type]);

  const showSvg = !imgSrc || imgError;
  const isLogo = hasLogo === true || hasLogo === 1 || hasLogo === '1';

  // Gradient ID safe name
  const gradId = `g-${color.replace('#', '')}-${isLogo ? 'logo' : 'plain'}`;

  const renderFallbackSvg = () => {
    if (type === 'hoodie') {
      return (
        <svg viewBox="0 0 400 420" className="w-full h-full object-contain">
          <path
            d="M130 50 Q200 -10 270 50 L350 100 L385 330 L330 340 L318 190 L318 395 L82 395 L82 190 L70 340 L15 330 L50 100 Z"
            fill={color}
          />
          <path
            d="M130 50 Q200 -10 270 50 Q200 110 130 50Z"
            fill="#000"
            fillOpacity="0.3"
          />
          <path
            d="M118 285 L282 285 L300 360 L100 360 Z"
            fill="#000"
            fillOpacity="0.18"
          />
          <path
            d="M180 90 L178 170 M220 90 L222 170"
            stroke="#fff"
            strokeOpacity="0.6"
            strokeWidth="3"
          />
        </svg>
      );
    }

    if (type === 'rack') {
      return (
        <svg viewBox="0 0 700 760" className="w-full h-full object-contain">
          <path
            d="M-20 90 Q300 130 520 220"
            stroke="#111"
            strokeWidth="22"
            fill="none"
          />
          {/* Rack Tee 1 */}
          <g transform="translate(10,60) scale(1.3)">
            <path
              d="M135 36 L172 28 Q200 58 228 28 L265 36 L365 92 L335 168 L292 146 L292 366 L108 366 L108 146 L65 168 L35 92 Z"
              fill="#d9c3ad"
            />
            <polygon points="82,96 112,96 97,120" fill="#111" />
          </g>
          {/* Rack Tee 2 */}
          <g transform="translate(170,120) scale(1.3)">
            <path
              d="M135 36 L172 28 Q200 58 228 28 L265 36 L365 92 L335 168 L292 146 L292 366 L108 366 L108 146 L65 168 L35 92 Z"
              fill="#1a1a1a"
            />
          </g>
          {/* Rack Tee 3 */}
          <g transform="translate(310,190) scale(1.3)">
            <path
              d="M135 36 L172 28 Q200 58 228 28 L265 36 L365 92 L335 168 L292 146 L292 366 L108 366 L108 146 L65 168 L35 92 Z"
              fill="#a81818"
            />
          </g>
        </svg>
      );
    }

    // Default: Tee
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full object-contain">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="1" stopColor="#000" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path
          d="M135 36 L172 28 Q200 58 228 28 L265 36 L365 92 L335 168 L292 146 L292 366 L108 366 L108 146 L65 168 L35 92 Z"
          fill={color}
        />
        <path
          d="M135 36 L172 28 Q200 58 228 28 L265 36 L365 92 L335 168 L292 146 L292 366 L108 366 L108 146 L65 168 L35 92 Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M172 28 Q200 58 228 28 Q200 78 172 28Z"
          fill="#000"
          fillOpacity="0.35"
        />
        {isLogo && (
          <>
            <polygon points="150,150 250,150 200,230" fill="#e10600" />
            <text
              x="200"
              y="262"
              textAnchor="middle"
              fontSize="22"
              letterSpacing="9"
              fill="#fff"
              fontFamily="Montserrat"
            >
              VYOMIK
            </text>
          </>
        )}
      </svg>
    );
  };

  return (
    <div className={`cloth ${className}`} data-type={type} data-color={color}>
      {imgSrc && !imgError && (
        <img
          src={imgSrc}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      )}
      {showSvg && renderFallbackSvg()}
    </div>
  );
};
