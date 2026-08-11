"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] h-[90vh]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative w-full ${sizeClasses[size]} rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200/80 z-10`}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {(title || description) && (
              <div className="mb-6 pr-8">
                {title && <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>}
                {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
              </div>
            )}

            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ModalBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`py-2 text-slate-700 ${className}`}>{children}</div>;
}

export function ModalFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}
