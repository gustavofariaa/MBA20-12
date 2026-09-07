'use client';

import React, { useState } from 'react';
import { VINTAGE_COLOR_OPTIONS, VINTAGE_ICON_OPTIONS, ColorOption, IconOption } from '@/data/playerCustomization';
import { PlayerIcon } from '@/components/common/PlayerIcon';
import { X, Check, Lock, Paintbrush, Sparkles, AlertTriangle } from 'lucide-react';

export interface CustomizationTarget {
  name: string;
  colorId: string;
  iconSymbol: string;
}

interface PlayerCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: CustomizationTarget | null;
  otherPlayers: CustomizationTarget[];
  onSave: (colorId: string, iconSymbol: string) => void;
}

export const PlayerCustomizationModal: React.FC<PlayerCustomizationModalProps> = ({
  isOpen,
  onClose,
  player,
  otherPlayers,
  onSave
}) => {
  const [prevPlayer, setPrevPlayer] = useState<CustomizationTarget | null>(player);
  const [selectedColorId, setSelectedColorId] = useState<string>(player?.colorId ?? '');
  const [selectedIconSymbol, setSelectedIconSymbol] = useState<string>(player?.iconSymbol ?? '');

  if (player !== prevPlayer) {
    setPrevPlayer(player);
    setSelectedColorId(player?.colorId ?? '');
    setSelectedIconSymbol(player?.iconSymbol ?? '');
  }

  if (!isOpen || !player) return null;

  // Determine disabled states based on uniqueness rule
  const isColorDisabled = (colorId: string) => {
    return otherPlayers.some((p) => p.colorId === colorId);
  };

  const isIconDisabled = (iconSymbol: string) => {
    return otherPlayers.some((p) => p.iconSymbol === iconSymbol);
  };

  const activeColorObj = VINTAGE_COLOR_OPTIONS.find((c) => c.id === selectedColorId) || VINTAGE_COLOR_OPTIONS[0];
  const activeIconObj = VINTAGE_ICON_OPTIONS.find((i) => i.symbol === selectedIconSymbol) || VINTAGE_ICON_OPTIONS[0];

  const handleSave = () => {
    if (isColorDisabled(selectedColorId) || isIconDisabled(selectedIconSymbol)) {
      return;
    }
    onSave(selectedColorId, selectedIconSymbol);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#FAF5E4] border-4 border-[#1C1917] rounded-2xl shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] p-6 md:p-8 space-y-6 text-[#1C1917] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b-3 border-[#1C1917] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] border-2 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] text-[#1C1917] text-xs font-cartoon uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-[#1C1917] text-[#1C1917]" />
              <span>Personalização de Jogador</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1C1917]" />
              <span>Gestão Ágil</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-cartoon tracking-wider text-[#1C1917]">
              Personalizar {player.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FFF8E7] hover:bg-[#F5E6C8] border-2 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-transform hover:scale-105 active:scale-95 cursor-pointer text-[#1C1917]"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Avatar Preview */}
        <div className="p-4 rounded-xl bg-[#FFF8E7] border-3 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border-3 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] ${activeColorObj.bgClass} text-white shrink-0`}
          >
            <PlayerIcon icon={activeIconObj.symbol} className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase font-cartoon tracking-wider text-stone-600">Prévia do Avatar</span>
            <div className="flex items-center gap-2">
              <span className={`text-base font-cartoon ${activeColorObj.textClass}`}>
                {activeColorObj.name}
              </span>
              <span className="text-xs font-retro text-stone-600">({activeIconObj.label})</span>
            </div>
          </div>
        </div>

        {/* Section 1: Color Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-cartoon text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-[#1C1917]" />
              Escolha a Cor (Exclusiva):
            </label>
            <span className="text-[10px] font-retro text-stone-500">Cores em uso ficam bloqueadas</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {VINTAGE_COLOR_OPTIONS.map((color: ColorOption) => {
              const disabled = isColorDisabled(color.id);
              const isSelected = selectedColorId === color.id;

              return (
                <button
                  key={color.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedColorId(color.id)}
                  className={`relative p-2.5 rounded-xl border-3 border-[#1C1917] flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    disabled
                      ? 'bg-[#D6D3D1] text-[#78716C] grayscale cursor-not-allowed border-[#1C1917] opacity-100'
                      : isSelected
                      ? 'bg-[#FFF8E7] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] ring-3 ring-[#F59E0B] scale-[1.03]'
                      : 'bg-[#FFF8E7] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:bg-[#FAF5E4]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-[#1C1917] shrink-0 ${color.bgClass} flex items-center justify-center`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>

                  <span className="text-xs font-cartoon text-[#1C1917] truncate">{color.name.split(' ')[0]}</span>

                  {disabled && (
                    <span className="absolute top-1 right-1 p-0.5 rounded bg-stone-700 text-white text-[9px]" title="Já escolhido por outro jogador">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Icon Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-cartoon text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1C1917]" />
              Escolha o Ícone (Exclusivo):
            </label>
            <span className="text-[10px] font-retro text-stone-500">Ícones em uso ficam bloqueados</span>
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {VINTAGE_ICON_OPTIONS.map((icon: IconOption) => {
              const disabled = isIconDisabled(icon.symbol);
              const isSelected = selectedIconSymbol === icon.symbol;

              return (
                <button
                  key={icon.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedIconSymbol(icon.symbol)}
                  className={`relative p-2.5 rounded-xl border-3 border-[#1C1917] flex flex-col items-center justify-center transition-all cursor-pointer ${
                    disabled
                      ? 'bg-[#D6D3D1] text-[#78716C] grayscale cursor-not-allowed border-[#1C1917] opacity-100'
                      : isSelected
                      ? 'bg-[#F59E0B] text-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] scale-110 ring-2 ring-[#1C1917]'
                      : 'bg-[#FFF8E7] text-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:bg-[#FAF5E4]'
                  }`}
                  title={icon.label}
                >
                  <div className="w-7 h-7 flex items-center justify-center">
                    <PlayerIcon icon={icon.symbol} className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-cartoon truncate max-w-full">{icon.label}</span>

                  {disabled && (
                    <span className="absolute top-0.5 right-0.5 p-0.5 rounded bg-stone-700 text-white text-[8px]" title="Já escolhido por outro jogador">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Warning if disabled selection somehow active */}
        {(isColorDisabled(selectedColorId) || isIconDisabled(selectedIconSymbol)) && (
          <div className="p-3 rounded-xl bg-[#FEE2E2] border-2 border-[#DC2626] text-[#991B1B] text-xs flex items-center gap-2 font-retro">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Cor ou ícone selecionado já está sendo usado por outro jogador!</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t-2 border-[#1C1917]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 border-2 border-[#1C1917] font-cartoon text-stone-700 text-xs uppercase tracking-wider cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isColorDisabled(selectedColorId) || isIconDisabled(selectedIconSymbol)}
            className="cartoon-btn py-2.5 px-6 text-sm font-cartoon uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:bg-[#D6D3D1] disabled:text-[#78716C] disabled:border-[#1C1917] disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-100"
          >
            <Check className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
