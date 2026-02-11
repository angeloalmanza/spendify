import { useEffect } from "react";

const EditModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const body = document.body;
    const getScrollbarWidth = () =>
      window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      const scrollbarWidth = getScrollbarWidth();
      body.style.overflow = "hidden";
      body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : "";
    } else {
      body.style.overflow = "auto";
      body.style.paddingRight = "";
    }
    return () => {
      body.style.overflow = "auto";
      body.style.paddingRight = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`glass-card rounded-2xl w-full max-w-xl p-4 transform transition-transform duration-200 dark:text-slate-100 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default EditModal;
