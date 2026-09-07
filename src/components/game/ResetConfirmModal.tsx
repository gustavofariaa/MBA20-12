"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  // Lock body scroll when modal is active
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="reset-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#1C1917]/80 backdrop-blur-xs overflow-y-auto pointer-events-auto"
      >
        <motion.div
          key="reset-modal-card"
          initial={{ scale: 0.8, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative bg-[#FAF5E4] border-4 border-[#1C1917] rounded-2xl shadow-[10px_10px_0px_0px_rgba(28,25,23,1)] p-6 sm:p-7 max-w-md w-full text-center space-y-5 text-[#1C1917]"
        >
          {/* Header Warning Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF2F2] border-2 border-[#DC2626] text-[#DC2626] text-xs font-cartoon uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>Confirmação da Ação</span>
          </div>

          {/* Icon Illustration */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#DC2626] text-white border-3 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] flex items-center justify-center">
            <RefreshCw className="w-7 h-7 stroke-[2.5]" />
          </div>

          {/* UX Copy Title & Description */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-cartoon text-[#1C1917] tracking-wide">
              Reiniciar a Partida?
            </h3>
            <p className="text-stone-700 text-xs sm:text-sm font-retro leading-relaxed bg-[#FFF8E7] p-3.5 rounded-xl border-2 border-[#1C1917]">
              Todo o progresso da Sprint atual será perdido e os jogadores
              retornarão ao lobby inicial. Tem certeza de que deseja recomeçar?
            </p>
          </div>

          {/* Modal CTA Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 border-2 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] font-cartoon text-stone-700 text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Continuar Jogando</span>
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white border-2 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-cartoon text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>Sim, Reiniciar</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
