import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const HeroVisualComposition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const hoodieRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Coordinated Cinematic Entrance Timeline matching specifications
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });

      // Glowing V emblem illuminates
      tl.fromTo(
        emblemRef.current,
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2 },
        0.1
      );

      // Glowing pedestal ring illuminates on the stone platform
      tl.fromTo(
        glowRingRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' },
        0.2
      );

      // Burnt orange fabric ribbons animate into position
      tl.fromTo(
        ribbonRef.current,
        { opacity: 0, x: 25, scale: 0.94 },
        { opacity: 1, x: 0, scale: 1, duration: 1.3 },
        0.25
      );

      // Hoodie product reveal (upward floating entrance)
      tl.fromTo(
        hoodieRef.current,
        { opacity: 0, y: 40, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power2.out' },
        0.35
      );

      // 2. Continuous Ambient Floating & Breathing Loops (GPU Accelerated)
      // Hoodie gentle harmonic float oscillation
      gsap.to(hoodieRef.current, {
        y: '-=9',
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.6,
      });

      // V emblem breathing golden illumination
      gsap.to(emblemRef.current, {
        scale: 1.012,
        opacity: 0.92,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.4,
      });

      // Ribbon slow flowing drift
      gsap.to(ribbonRef.current, {
        y: '+=6',
        rotation: 0.8,
        duration: 5.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5,
      });

      // Pedestal glowing ring gentle pulse
      gsap.to(glowRingRef.current, {
        opacity: 0.82,
        scale: 1.025,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2,
      });
    }, containerRef);

    // 3. Desktop Interactive Cursor Parallax Depth
    const isDesktopPointer =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
        : true;

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDesktopPointer) return;

      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 2;
      targetY = (e.clientY / innerHeight - 0.5) * 2;

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          // Hoodie: smooth subtle movement with restrained X/Y tilt
          if (hoodieRef.current) {
            gsap.to(hoodieRef.current, {
              x: targetX * 16,
              y: targetY * 8,
              rotationY: targetX * 2.2,
              rotationX: -targetY * 1.8,
              duration: 0.75,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }

          // Fabric Ribbon: midground parallax
          if (ribbonRef.current) {
            gsap.to(ribbonRef.current, {
              x: targetX * 10,
              y: targetY * 5,
              duration: 0.9,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }

          // V Emblem: background depth parallax
          if (emblemRef.current) {
            gsap.to(emblemRef.current, {
              x: targetX * 5,
              y: targetY * 3,
              duration: 1.15,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }

          // Pedestal Ring: ground plane perspective tracking
          if (glowRingRef.current) {
            gsap.to(glowRingRef.current, {
              x: targetX * 4,
              duration: 1.2,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }

          rafId = null;
        });
      }
    };

    // Smooth return to neutral resting state when cursor leaves the window
    const handleMouseLeave = () => {
      if (!isDesktopPointer) return;

      if (hoodieRef.current) {
        gsap.to(hoodieRef.current, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          duration: 1.2,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
      if (ribbonRef.current) {
        gsap.to(ribbonRef.current, {
          x: 0,
          y: 0,
          duration: 1.3,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
      if (emblemRef.current) {
        gsap.to(emblemRef.current, {
          x: 0,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
      if (glowRingRef.current) {
        gsap.to(glowRingRef.current, {
          x: 0,
          duration: 1.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative flex items-center justify-center select-none"
    >
      {/* Layer 1: Ambient Warm Golden Backlight Glow */}
      <div
        className="absolute w-[280px] sm:w-[380px] lg:w-[440px] h-[280px] sm:h-[380px] lg:h-[440px] rounded-full bg-[#A64B2A]/22 blur-[90px] pointer-events-none z-0 lg:-translate-y-[55px] lg:-translate-x-[45px] xl:-translate-x-[55px] will-change-transform"
        aria-hidden="true"
      />

      {/* Layer 2: Glowing Angular V Emblem (Behind the Hoodie) */}
      <div
        className="absolute w-[76%] sm:w-[72%] lg:w-[76%] xl:w-[78%] max-w-[540px] top-[2%] sm:top-[3%] lg:top-[1%] xl:top-[0%] z-10 pointer-events-none flex items-center justify-center lg:-translate-y-[25px] lg:-translate-x-[45px] xl:-translate-x-[55px] will-change-transform"
      >
        <div
          ref={emblemRef}
          className="w-full flex items-center justify-center"
          style={{
            filter:
              'drop-shadow(0 0 14px rgba(245,185,100,0.32)) drop-shadow(0 0 38px rgba(166,75,42,0.22))',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
        >
          <img
            src="/assets/glowing-v-emblem-trimmed.png"
            alt="VYOMIK Illuminated Geometric V Emblem"
            className="w-full h-auto object-contain"
            loading="eager"
          />
        </div>
      </div>

      {/* Layer 3: Flowing Burnt-Orange Fabric Ribbon (Asymmetrical Silk Ribbon wrapping around hoodie) */}
      <div
        className="absolute w-[96%] sm:w-[92%] lg:w-[94%] xl:w-[96%] max-w-[670px] top-[7%] sm:top-[8%] lg:top-[5%] xl:top-[4%] z-15 pointer-events-none flex items-center justify-center lg:-translate-y-[35px] lg:-translate-x-[45px] xl:-translate-x-[55px] will-change-transform"
      >
        <div
          ref={ribbonRef}
          className="w-full flex items-center justify-center"
          style={{
            filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.55)) brightness(0.96)',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        >
          <img
            src="/assets/burnt-orange-ribbon-trimmed.png"
            alt="Burnt Orange Flowing Silk Ribbon"
            className="w-full h-auto object-contain"
            loading="eager"
          />
        </div>
      </div>

      {/* Layer 4: Warm Glowing Elliptical Ring on the Stone Pedestal */}
      <div
        ref={glowRingRef}
        className="absolute w-[340px] sm:w-[410px] lg:w-[450px] h-[75px] sm:h-[88px] lg:h-[94px] bottom-[2%] sm:bottom-[3%] lg:bottom-[4%] z-10 pointer-events-none flex items-center justify-center lg:-translate-x-[45px] xl:-translate-x-[55px] will-change-transform"
        style={{
          perspective: '600px',
        }}
      >
        <div
          className="w-full h-full rounded-[100%] border-[2.5px] border-[#F5B964] shadow-[0_0_24px_rgba(245,185,100,0.85),0_0_50px_rgba(166,75,42,0.65),inset_0_0_15px_rgba(245,185,100,0.45)]"
          style={{
            transform: 'rotateX(72deg) translateZ(0)',
          }}
        />
      </div>

      {/* Layer 5: Authentic VYOMIK Warm-Ivory Oversized Hoodie (Floating Hero Focal Point) */}
      <div
        className="relative z-20 w-[68%] sm:w-[64%] md:w-[60%] lg:w-[66%] xl:w-[68%] max-w-[425px] xl:max-w-[435px] flex items-center justify-center pointer-events-auto lg:-translate-y-[65px] xl:-translate-y-[70px] lg:-translate-x-[45px] xl:-translate-x-[55px] will-change-transform"
      >
        <div
          ref={hoodieRef}
          className="w-full flex items-center justify-center"
          style={{
            filter:
              'drop-shadow(0 20px 40px rgba(0,0,0,0.85)) drop-shadow(0 6px 14px rgba(0,0,0,0.7))',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        >
          <img
            src="/assets/vyomik-original-hoodie.png"
            alt="VYOMIK Luxury Oversized Warm-Ivory Streetwear Hoodie"
            className="w-full h-auto object-contain"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};
