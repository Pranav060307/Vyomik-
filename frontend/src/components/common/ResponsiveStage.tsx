import React, { useLayoutEffect, useState, useRef, ReactNode } from 'react';

interface ResponsiveStageProps {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
  stageHeight?: number; // for scroll mode
  onScaleChange?: (scale: number) => void;
}

export const ResponsiveStage: React.FC<ResponsiveStageProps> = ({
  children,
  scroll = false,
  className = '',
  stageHeight,
  onScaleChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const getInitialScale = () => {
    if (typeof window === 'undefined') return 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    return scroll ? w / 1920 : Math.min(w / 1920, h / 1080);
  };

  const [scale, setScale] = useState<number>(getInitialScale);
  const [wrapperHeight, setWrapperHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (scroll) {
        // Desktop / scroll mode: scale by width / 1920
        const s = w / 1920;
        (window as unknown as { __scale?: number }).__scale = s;
        setScale(s);
        onScaleChange?.(s);

        if (stageRef.current) {
          const currentStageH = stageHeight || stageRef.current.offsetHeight || 2200;
          setWrapperHeight(currentStageH * s);
        }
      } else {
        // Fixed 16:9 1920x1080 canvas
        const s = Math.min(w / 1920, h / 1080);
        (window as unknown as { __scale?: number }).__scale = s;
        setScale(s);
        onScaleChange?.(s);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const interval = setInterval(handleResize, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [scroll, stageHeight, onScaleChange]);

  if (scroll) {
    return (
      <div
        ref={containerRef}
        className="w-full relative overflow-x-hidden bg-[#050505]"
        style={{ height: wrapperHeight ? `${wrapperHeight}px` : 'auto', minHeight: '100vh' }}
      >
        <div
          ref={stageRef}
          id="stage"
          className={`w-[1920px] bg-[#050505] origin-top-left ${className}`}
          style={{
            transform: `scale(${scale})`,
            minHeight: '1080px',
            height: stageHeight ? `${stageHeight}px` : undefined,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Fixed 1920x1080 canvas
  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-black relative select-none"
    >
      <div
        ref={stageRef}
        id="stage"
        className={`w-[1920px] h-[1080px] shrink-0 bg-[#050505] absolute left-1/2 top-1/2 origin-center overflow-hidden ${className}`}
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
