import React from 'react';
import { useNavigate } from 'react-router-dom';

interface VyomikLogoProps {
  inverted?: boolean;
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
  onClick?: () => void;
}

export const VyomikLogo: React.FC<VyomikLogoProps> = ({
  inverted = false,
  className = '',
  markClassName = 'w-[60px] h-auto',
  textClassName = 'font-semibold tracking-[0.5em] text-[34px] leading-none',
  showText = true,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/home');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`logo flex items-center gap-[22px] cursor-pointer select-none ${className}`}
      role="banner"
      aria-label="VYOMIK"
    >
      <svg
        className={`logo-mark ${markClassName}`}
        viewBox="0 0 80 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="0,0 80,0 40,66"
          fill={inverted ? '#0b0b0b' : '#C85A2E'}
        />
        <polygon
          points="14,8 38,8 40,22 52,8 66,8 40,52"
          fill={inverted ? '#C85A2E' : '#0b0b0b'}
        />
        <polygon
          points="28,16 40,34 52,16 44,16 40,22 36,16"
          fill={inverted ? '#0b0b0b' : '#C85A2E'}
        />
      </svg>
      {showText && <span className={`logo-text ${textClassName}`}>VYOMIK</span>}
    </div>
  );
};
