import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCustomMedia } from '@/context/CustomMediaContext';
import CustomizeMediaPanel from './CustomizeMediaPanel';

export default function AudioPlayer() {
  const { audioUrl } = useCustomMedia();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayPrompt, setShowPlayPrompt] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Update audio source when audioUrl changes
    audio.src = audioUrl;
    audio.load();

    // If was playing, try to resume
    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        setShowPlayPrompt(true);
      });
    }
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Try to autoplay on mount
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setShowPlayPrompt(false);
        })
        .catch(() => {
          // Autoplay was blocked
          setShowPlayPrompt(true);
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setShowPlayPrompt(false);
      }).catch(() => {
        setShowPlayPrompt(true);
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src={audioUrl} type="audio/mpeg" />
      </audio>

      <Card className="fixed right-4 top-4 z-50 border-2 border-rose-300 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {showPlayPrompt && !isPlaying && (
            <span className="text-xs text-rose-500 animate-pulse">Tap to play music 🎵</span>
          )}
          
          <Button
            size="icon"
            variant="ghost"
            onClick={togglePlay}
            className="h-8 w-8 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            className="h-8 w-8 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowCustomize(true)}
            className="h-8 w-8 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
            title="Customize photos and music"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <CustomizeMediaPanel open={showCustomize} onOpenChange={setShowCustomize} />
    </>
  );
}
