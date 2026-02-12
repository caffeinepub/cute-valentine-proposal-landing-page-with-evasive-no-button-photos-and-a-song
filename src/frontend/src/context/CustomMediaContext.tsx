import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveMedia, loadMedia, clearAllMedia } from '@/lib/customMediaStorage';

interface CustomMediaContextType {
  photoUrls: [string, string, string];
  audioUrl: string;
  feelingsText: string;
  isLoading: boolean;
  setPreviewPhotos: (photos: (File | null)[]) => void;
  setPreviewAudio: (audio: File | null) => void;
  setPreviewFeelings: (text: string) => void;
  applyCustomMedia: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const defaultPhotoUrls: [string, string, string] = [
  '/assets/generated/couple-photo-1.dim_1200x1600.png',
  '/assets/generated/couple-photo-2.dim_1200x1600.png',
  '/assets/generated/couple-photo-3.dim_1200x1600.png',
];

const defaultAudioUrl = '/assets/generated/valentine-song.mp3';

const defaultFeelingsText = `Every moment with you feels like a dream come true. You bring so much joy, laughter, and love into my life. I can't imagine my days without your smile, your warmth, and your beautiful heart. You are my everything, and I'm so grateful to have you by my side. Here's to us and all the wonderful memories we'll create together! 💕`;

const CustomMediaContext = createContext<CustomMediaContextType | undefined>(undefined);

export function CustomMediaProvider({ children }: { children: ReactNode }) {
  const [photoUrls, setPhotoUrls] = useState<[string, string, string]>(defaultPhotoUrls);
  const [audioUrl, setAudioUrl] = useState<string>(defaultAudioUrl);
  const [feelingsText, setFeelingsText] = useState<string>(defaultFeelingsText);
  const [isLoading, setIsLoading] = useState(true);
  const [previewPhotos, setPreviewPhotos] = useState<(File | null)[]>([null, null, null]);
  const [previewAudio, setPreviewAudio] = useState<File | null>(null);
  const [previewFeelings, setPreviewFeelings] = useState<string>('');

  // Load persisted media on mount
  useEffect(() => {
    loadPersistedMedia();
  }, []);

  async function loadPersistedMedia() {
    setIsLoading(true);
    try {
      const loadedPhotos: [string, string, string] = [...defaultPhotoUrls];
      
      // Load photos
      for (let i = 0; i < 3; i++) {
        const blob = await loadMedia(`photo-${i}`);
        if (blob) {
          loadedPhotos[i] = URL.createObjectURL(blob);
        }
      }

      // Load audio
      const audioBlob = await loadMedia('audio');
      const loadedAudio = audioBlob ? URL.createObjectURL(audioBlob) : defaultAudioUrl;

      // Load feelings text
      const feelingsBlob = await loadMedia('feelings');
      let loadedFeelings = defaultFeelingsText;
      if (feelingsBlob) {
        loadedFeelings = await feelingsBlob.text();
      }

      setPhotoUrls(loadedPhotos);
      setAudioUrl(loadedAudio);
      setFeelingsText(loadedFeelings);
    } catch (error) {
      console.error('Failed to load persisted media:', error);
      // Fall back to defaults on error
      setPhotoUrls(defaultPhotoUrls);
      setAudioUrl(defaultAudioUrl);
      setFeelingsText(defaultFeelingsText);
    } finally {
      setIsLoading(false);
    }
  }

  async function applyCustomMedia() {
    try {
      const newPhotoUrls: [string, string, string] = [...photoUrls];

      // Save and apply photos
      for (let i = 0; i < 3; i++) {
        if (previewPhotos[i]) {
          await saveMedia(`photo-${i}`, previewPhotos[i]!, 'photo');
          // Revoke old URL if it's a blob URL
          if (photoUrls[i].startsWith('blob:')) {
            URL.revokeObjectURL(photoUrls[i]);
          }
          newPhotoUrls[i] = URL.createObjectURL(previewPhotos[i]!);
        }
      }

      // Save and apply audio
      if (previewAudio) {
        await saveMedia('audio', previewAudio, 'audio');
        // Revoke old URL if it's a blob URL
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(URL.createObjectURL(previewAudio));
      }

      // Save and apply feelings text
      if (previewFeelings.trim()) {
        const textBlob = new Blob([previewFeelings], { type: 'text/plain' });
        await saveMedia('feelings', textBlob, 'text');
        setFeelingsText(previewFeelings);
      }

      setPhotoUrls(newPhotoUrls);
      
      // Clear preview state
      setPreviewPhotos([null, null, null]);
      setPreviewAudio(null);
      setPreviewFeelings('');
    } catch (error) {
      console.error('Failed to apply custom media:', error);
      throw error;
    }
  }

  async function resetToDefaults() {
    try {
      // Clear all stored media
      await clearAllMedia();

      // Revoke blob URLs
      photoUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      if (audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }

      // Reset to defaults
      setPhotoUrls(defaultPhotoUrls);
      setAudioUrl(defaultAudioUrl);
      setFeelingsText(defaultFeelingsText);
      setPreviewPhotos([null, null, null]);
      setPreviewAudio(null);
      setPreviewFeelings('');
    } catch (error) {
      console.error('Failed to reset to defaults:', error);
      throw error;
    }
  }

  return (
    <CustomMediaContext.Provider
      value={{
        photoUrls,
        audioUrl,
        feelingsText,
        isLoading,
        setPreviewPhotos,
        setPreviewAudio,
        setPreviewFeelings,
        applyCustomMedia,
        resetToDefaults,
      }}
    >
      {children}
    </CustomMediaContext.Provider>
  );
}

export function useCustomMedia() {
  const context = useContext(CustomMediaContext);
  if (!context) {
    throw new Error('useCustomMedia must be used within CustomMediaProvider');
  }
  return context;
}
