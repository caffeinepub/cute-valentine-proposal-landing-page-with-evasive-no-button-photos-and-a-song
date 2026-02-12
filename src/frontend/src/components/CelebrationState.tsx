import { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PhotoCollage from './PhotoCollage';
import AudioPlayer from './AudioPlayer';
import ValentineDecor from './ValentineDecor';
import { useCustomMedia } from '@/context/CustomMediaContext';

export default function CelebrationState() {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  const { feelingsText } = useCustomMedia();

  useEffect(() => {
    const newHearts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ValentineDecor />
      
      {/* Floating hearts animation */}
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="absolute animate-float-up fill-rose-300 text-rose-300 opacity-60"
          style={{
            left: `${heart.x}%`,
            bottom: '-50px',
            animationDelay: `${heart.delay}s`,
            width: '30px',
            height: '30px',
          }}
        />
      ))}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <AudioPlayer />
        
        <Card className="max-w-2xl border-4 border-rose-300 bg-white/95 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-8 text-center md:p-12">
            <div className="mb-6 flex justify-center">
              <Sparkles className="h-20 w-20 animate-spin-slow text-rose-400" />
            </div>
            
            <h1 className="mb-4 text-5xl font-bold text-rose-600 md:text-6xl animate-bounce-slow">
              Yay! 🎉
            </h1>
            
            <p className="mb-6 text-2xl text-rose-500 md:text-3xl">
              You made me the happiest person! 💕
            </p>
            
            <p className="mb-8 text-xl text-rose-400">
              Happy Valentine's Day, my love! ❤️
            </p>

            <div className="mb-6 flex justify-center gap-4">
              <Heart className="h-8 w-8 animate-pulse fill-rose-400 text-rose-400" />
              <Heart className="h-8 w-8 animate-pulse fill-rose-500 text-rose-500" style={{ animationDelay: '0.2s' }} />
              <Heart className="h-8 w-8 animate-pulse fill-rose-600 text-rose-600" style={{ animationDelay: '0.4s' }} />
            </div>

            {/* Feelings paragraph */}
            <div className="mb-8 rounded-lg bg-rose-50 p-6 border-2 border-rose-200">
              <p className="text-base leading-relaxed text-rose-700 whitespace-pre-wrap md:text-lg">
                {feelingsText}
              </p>
            </div>

            <PhotoCollage />
          </CardContent>
        </Card>

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
