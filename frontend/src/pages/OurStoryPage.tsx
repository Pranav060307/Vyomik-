import React, { useState } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WaitlistModal } from '../components/landing/WaitlistModal';
import { BagDrawer } from '../components/shop/BagDrawer';
import { DEMO_IMAGES } from '../config/demoContent';

export const OurStoryPage: React.FC = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F3EE] text-[#202020]">
      <AnnouncementBar />
      <Header
        bagCount={0}
        onOpenBag={() => setIsBagOpen(true)}
        onOpenNotifyModal={() => setIsWaitlistOpen(true)}
      />

      <main className="flex-1 max-w-5xl mx-auto px-6 sm:px-8 py-20 w-full">
        {/* Eyebrow */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5C6548] block mb-3">
          ORIGIN & PHILOSOPHY
        </span>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#202020] mb-8 leading-[1.08]">
          Quiet confidence.<br />Room to be you.
        </h1>

        {/* Feature Story Image */}
        <div className="border border-[#DAD7CE] my-10 aspect-[16/9] w-full overflow-hidden bg-[#EAE7DF]">
          <img
            src={DEMO_IMAGES.story}
            alt="VYOMIK Studio moodboard"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Editorial Text */}
        <div className="prose prose-stone max-w-none space-y-6 text-sm sm:text-base text-[#202020]/80 leading-relaxed">
          <p className="text-lg sm:text-xl font-normal text-[#202020] leading-relaxed">
            VYOMIK was conceived around a single deliberate question: what if clothing gave you space rather than demanding attention?
          </p>
          <p>
            We build oversized essentials with architectural precision. Our plain tees, wordmark tees, and heavyweight hoodies are engineered with dropped shoulders, balanced armholes, and dense neckbands that keep their drape through hundreds of wears.
          </p>
          <p>
            Launching publicly on 8 November 2026, First Drop represents months of pattern refinement and print experimentation. Every silhouette is crafted from high-density 240 GSM combed cotton and 450 GSM French terry.
          </p>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 p-8 border border-[#202020] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-[#202020]">
              Be part of First Drop.
            </h2>
            <p className="text-xs text-[#202020]/70 mt-1">
              Doors open on 8 November 2026. Join the early-access guest list.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsWaitlistOpen(true)}
            className="bg-[#202020] text-[#F4F3EE] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#333333] transition-colors"
          >
            Join Waitlist ↗
          </button>
        </div>
      </main>

      <Footer onOpenNotifyModal={() => setIsWaitlistOpen(true)} />
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        initialSource="our_story"
      />
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
      />
    </div>
  );
};
