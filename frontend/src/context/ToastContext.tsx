import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
        className={`fixed left-1/2 bottom-[60px] -translate-x-1/2 z-[100] transition-all duration-300 pointer-events-none ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        <div className="bg-[#e10600] text-white px-[38px] py-[18px] text-[20px] md:text-[24px] font-semibold rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-w-[90vw] md:max-w-[1300px] text-center tracking-wide">
          {message}
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
