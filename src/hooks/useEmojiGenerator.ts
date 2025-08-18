import { useReducer, useEffect } from 'react';
import {
  fetchFonts,
  generateEmoji,
  ERROR_PLACEHOLDER_IMAGE,
  type FontCategory,
} from '@lib/api';
import { EMOJI_WIDTH, EMOJI_HEIGHT, DEBOUNCE_TIME_MS } from '@lib/constants';

type TextAlign = 'left' | 'center' | 'right';

// 状態の型定義
interface State {
  text: string;
  font: string;
  textColor: string;
  backgroundColor: string;
  useBackgroundColor: boolean;
  textAlign: TextAlign;
  isSizeFixed: boolean;
  isStretchDisabled: boolean;
  fontCategories: FontCategory[];
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

// アクションの型定義
type Action =
  | { type: 'SET_STATE'; payload: Partial<State> }
  | { type: 'SET_FONT_CATEGORIES'; payload: FontCategory[] }
  | { type: 'SET_INITIAL_FONT'; payload: string }
  | { type: 'GENERATION_START' }
  | { type: 'GENERATION_SUCCESS'; payload: string }
  | { type: 'GENERATION_ERROR'; payload: string }
  | { type: 'CLEANUP_IMAGE' };

// 初期状態
const initialState: State = {
  text: '絵文字',
  font: '',
  textColor: '#ffffffff',
  backgroundColor: '#000000ff',
  useBackgroundColor: false,
  textAlign: 'center',
  isSizeFixed: false,
  isStretchDisabled: false,
  fontCategories: [],
  generatedImage: null,
  isLoading: true,
  error: null,
};

// Reducer関数
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'SET_FONT_CATEGORIES':
      return { ...state, fontCategories: action.payload };
    case 'SET_INITIAL_FONT':
      return { ...state, font: action.payload };
    case 'GENERATION_START':
      return { ...state, isLoading: true, error: null };
    case 'GENERATION_SUCCESS':
      // 前の画像を解放
      if (state.generatedImage && state.generatedImage.startsWith('blob:')) {
        URL.revokeObjectURL(state.generatedImage);
      }
      return { ...state, isLoading: false, generatedImage: action.payload };
    case 'GENERATION_ERROR':
      // 前の画像を解放
      if (state.generatedImage && state.generatedImage.startsWith('blob:')) {
        URL.revokeObjectURL(state.generatedImage);
      }
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        generatedImage: ERROR_PLACEHOLDER_IMAGE,
      };
    case 'CLEANUP_IMAGE':
      if (state.generatedImage && state.generatedImage.startsWith('blob:')) {
        URL.revokeObjectURL(state.generatedImage);
      }
      return { ...state, generatedImage: null };
    default:
      return state;
  }
};

export const useEmojiGenerator = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    text,
    font,
    textColor,
    backgroundColor,
    useBackgroundColor,
    textAlign,
    isSizeFixed,
    isStretchDisabled,
    generatedImage,
  } = state;

  const adContent = null; // This is a placeholder for future use.

  // --- アクションをディスパッチするヘルパー関数 ---
  const setState = (payload: Partial<State>) =>
    dispatch({ type: 'SET_STATE', payload });

  useEffect(() => {
    const loadFonts = async () => {
      try {
        const data = await fetchFonts();
        dispatch({ type: 'SET_FONT_CATEGORIES', payload: data });
        if (data.length > 0 && data[0].fonts.length > 0) {
          dispatch({
            type: 'SET_INITIAL_FONT',
            payload: data[0].fonts[0].value,
          });
        }
      } catch (e) {
        const errorMessage =
          'フォントの読み込みに失敗しました。APIの形式が不正か、サーバーがダウンしています。';
        dispatch({ type: 'GENERATION_ERROR', payload: errorMessage });
        console.error(e);
      }
    };
    loadFonts();
  }, []);

  useEffect(() => {
    if (!font) return;

    const handler = setTimeout(() => {
      if (!text) {
        dispatch({ type: 'CLEANUP_IMAGE' });
        dispatch({ type: 'SET_STATE', payload: { isLoading: false } });
        return;
      }

      const generateImageFromApi = async () => {
        dispatch({ type: 'GENERATION_START' });

        try {
          const payload = {
            text: text,
            width: EMOJI_WIDTH,
            height: EMOJI_HEIGHT,
            align: textAlign,
            color: textColor,
            background_color: useBackgroundColor
              ? backgroundColor
              : '#00000000',
            typeface_name: font,
            size_fixed: isSizeFixed,
            disable_stretch: isStretchDisabled,
          };

          const imageBlob = await generateEmoji(payload);
          dispatch({
            type: 'GENERATION_SUCCESS',
            payload: URL.createObjectURL(imageBlob),
          });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : '不明なエラーが発生しました。';
          dispatch({ type: 'GENERATION_ERROR', payload: errorMessage });
        }
      };

      generateImageFromApi();
    }, DEBOUNCE_TIME_MS);

    return () => {
      clearTimeout(handler);
    };
  }, [
    text,
    font,
    textColor,
    backgroundColor,
    useBackgroundColor,
    textAlign,
    isSizeFixed,
    isStretchDisabled,
  ]);

  // Cleanup for the generated blob URL on unmount
  useEffect(() => {
    const currentImage = generatedImage;
    return () => {
      if (currentImage && currentImage.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage);
      }
    };
  }, [generatedImage]);

  return {
    ...state,
    adContent,
    // 個別のセッターの代わりに、ペイロードを受け取る関数を公開
    setText: (text: string) => setState({ text }),
    setFont: (font: string) => setState({ font }),
    setTextColor: (textColor: string) => setState({ textColor }),
    setBackgroundColor: (backgroundColor: string) =>
      setState({ backgroundColor }),
    setUseBackgroundColor: (useBackgroundColor: boolean) =>
      setState({ useBackgroundColor }),
    setTextAlign: (textAlign: TextAlign) => setState({ textAlign }),
    setIsSizeFixed: (isSizeFixed: boolean) => setState({ isSizeFixed }),
    setIsStretchDisabled: (isStretchDisabled: boolean) =>
      setState({ isStretchDisabled }),
  };
};
