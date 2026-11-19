import React from 'react';

interface CountdownTileProps {
  value: string;
  label: string;
}

export const CountdownTile: React.FC<CountdownTileProps> = ({ value, label }) => {
  return (
    <div className="w-[58px] sm:w-[68px] md:w-[76px] lg:w-[82px] h-[58px] sm:h-[68px] md:h-[76px] lg:h-[82px] rounded-xl sm:rounded-2xl bg-[#141210]/85 border border-[#A64B2A]/35 shadow-[0_8px_24px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center p-1 backdrop-blur-sm select-none transition-transform hover:scale-105 duration-200">
      <span className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-bold text-[#F4F0E8] font-montserrat [font-variant-numeric:tabular-nums] tracking-tight leading-none mb-1">
        {value}
      </span>
      <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-[#716B63] tracking-[0.2em] font-montserrat uppercase">
        {label}
      </span>
    </div>
  );
};
