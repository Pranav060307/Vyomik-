import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastContextType {
  toast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const toast = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Notification Element */}
      <div
        className={`fixed left-1/2 bottom-8 -translate-x-1/2 z-[100] transition-all duration-300 pointer-events-none ${
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="bg-[#141414]/95 backdrop-blur-md border border-[#242321] text-[#F4F0E8] px-5 py-3 text-xs sm:text-sm font-montserrat font-semibold rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] max-w-[90vw] text-center tracking-wide flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-[#C85A2E] flex-shrink-0" />
          <span>{message}</span>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast: (msg: string) => console.log('Toast:', msg),
    };
  }
  return ctx;
};
