import { createContext, useContext } from 'react';
import type { FontCategory } from '@lib/api';

type TextAlign = 'left' | 'center' | 'right';

export interface EmojiGeneratorContextType {
  text: string;
  setText: (text: string) => void;
  font: string;
  setFont: (font: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  useBackgroundColor: boolean;
  setUseBackgroundColor: (use: boolean) => void;
  textAlign: TextAlign;
  setTextAlign: (align: TextAlign) => void;
  isSizeFixed: boolean;
  setIsSizeFixed: (isFixed: boolean) => void;
  isStretchDisabled: boolean;
  setIsStretchDisabled: (isDisabled: boolean) => void;
  fontCategories: FontCategory[];
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  adContent: string | null;
}

const EmojiGeneratorContext = createContext<EmojiGeneratorContextType | null>(
  null,
);

export const EmojiGeneratorProvider = EmojiGeneratorContext.Provider;

export const useEmojiGeneratorContext = () => {
  const context = useContext(EmojiGeneratorContext);
  if (!context) {
    throw new Error(
      'useEmojiGeneratorContext must be used within a EmojiGeneratorProvider',
    );
  }
  return context;
};
