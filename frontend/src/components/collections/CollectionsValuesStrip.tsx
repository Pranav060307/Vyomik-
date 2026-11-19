import React from 'react';

interface BrandValue {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const BRAND_VALUES: BrandValue[] = [
  {
    id: 'materials',
    title: 'Premium Materials',
    description: 'Built for long-lasting wear',
    icon: (
      // Three isometric stacked diamond sheets
      <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 8l10 5 10-5-10-5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 13l10 5 10-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 18l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'sustainability',
    title: 'Sustainable Approach',
    description: 'Thoughtful, responsible fashion',
    icon: (
      // Leaf line outline
      <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9c0-4.97 4.03-9 9-9 4.97 0 9 4.03 9 9 0 4.97-4.03 9-9 9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c4.97 0 9 4.03 9 9" />
      </svg>
    ),
  },
  {
    id: 'timeless',
    title: 'Timeless Design',
    description: 'Style beyond seasons',
    icon: (
      // Infinity loop
      <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.26-8-12.356-8-5.096 0-5.096 8 0 8 5.096 0 7.261-8 12.356-8z" />
      </svg>
    ),
  },
  {
    id: 'drops',
    title: 'New Drops Regularly',
    description: 'Fresh collections, all year round',
    icon: (
      // Lightning bolt line
      <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
      </svg>
    ),
  },
];

export const CollectionsValuesStrip: React.FC = () => {
  return (
    <section className="w-full bg-[#0B0B0B] border-t border-b border-[#242321]/50 py-5 lg:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-white/10 items-center">
          {BRAND_VALUES.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-center gap-3.5 transition-colors duration-200 group ${
                idx === 0 ? 'lg:pr-6' : idx === BRAND_VALUES.length - 1 ? 'lg:pl-6' : 'lg:px-6'
              }`}
            >
              <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:text-[#C85A2E]">
                {item.icon}
              </div>
              <div>
                <h4 className="text-[13px] font-semibold tracking-wide text-white font-montserrat group-hover:text-[#F4F0E8]">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#D9D1C3]/70 font-light mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
