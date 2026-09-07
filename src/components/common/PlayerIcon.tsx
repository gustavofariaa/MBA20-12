'use client';

import React from 'react';
import { Rocket, Zap, Star, Clover, Coffee, Milk, Bot, Flame, Crown, Target } from 'lucide-react';

interface PlayerIconProps {
  icon: string;
  className?: string;
}

export const PlayerIcon: React.FC<PlayerIconProps> = ({ icon, className = 'w-4 h-4' }) => {
  switch (icon) {
    case 'rocket':
    case '🚀':
      return <Rocket className={className} />;
    case 'bolt':
    case '⚡':
      return <Zap className={className} />;
    case 'star':
    case '⭐':
      return <Star className={className} />;
    case 'clover':
    case '☘️':
      return <Clover className={className} />;
    case 'cup':
    case '☕':
      return <Coffee className={className} />;
    case 'glass':
    case '🥛':
      return <Milk className={className} />;
    case 'monster':
    case '👾':
      return <Bot className={className} />;
    case 'fire':
    case '🔥':
      return <Flame className={className} />;
    case 'crown':
    case '👑':
      return <Crown className={className} />;
    case 'target':
    case '🎯':
      return <Target className={className} />;
    default:
      return <Star className={className} />;
  }
};
