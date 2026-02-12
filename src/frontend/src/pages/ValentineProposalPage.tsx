import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import CelebrationState from '@/components/CelebrationState';
import PhotoCollage from '@/components/PhotoCollage';
import AudioPlayer from '@/components/AudioPlayer';
import ValentineDecor from '@/components/ValentineDecor';
import useEvasivePosition from '@/hooks/useEvasivePosition';

export default function ValentineProposalPage() {
  const [hasAccepted, setHasAccepted] = useState(false);
  const { position, handlePointerEnter, handleTouchStart } = useEvasivePosition();

  if (hasAccepted) {
    return <CelebrationState />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ValentineDecor />
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <AudioPlayer />
        
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <Heart className="h-16 w-16 animate-pulse fill-rose-400 text-rose-400" />
          </div>
          
          <h1 className="mb-4 text-5xl font-bold text-rose-600 md:text-7xl animate-float">
            Will you be my valentine?
          </h1>
          
          <p className="text-xl text-rose-400 md:text-2xl">
            Please say yes... 💕
          </p>
        </div>

        <PhotoCollage />

        <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <Button
            size="lg"
            onClick={() => setHasAccepted(true)}
            className="h-16 w-40 text-2xl font-bold shadow-xl transition-all hover:scale-110 hover:shadow-2xl"
          >
            Yes! 💖
          </Button>

          <Button
            size="lg"
            variant="outline"
            style={{
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              transition: 'all 0.3s ease-out',
            }}
            onPointerEnter={handlePointerEnter}
            onTouchStart={handleTouchStart}
            className="h-16 w-40 text-2xl font-bold shadow-lg"
          >
            No 😢
          </Button>
        </div>

        <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-rose-300">
          <p>
            © {new Date().getFullYear()} · Built with <Heart className="inline h-4 w-4 fill-rose-400 text-rose-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-rose-400"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
