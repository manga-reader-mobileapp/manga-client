import React from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Popup({ isOpen, onClose, children }: PopupProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 bg-opacity-60 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white text-black p-6 rounded-xl shadow-lg max-w-full max-h-full overflow-auto"
        onClick={(e) => e.stopPropagation()} // Impede que o clique interno feche
      >
        {children}
      </div>
    </div>
  );
}
