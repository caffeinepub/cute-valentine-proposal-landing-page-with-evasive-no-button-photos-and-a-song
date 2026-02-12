import { Card } from '@/components/ui/card';
import { useCustomMedia } from '@/context/CustomMediaContext';

export default function PhotoCollage() {
  const { photoUrls, isLoading } = useCustomMedia();

  const photos = [
    { src: photoUrls[0], alt: 'Our memory 1', rotation: -3 },
    { src: photoUrls[1], alt: 'Our memory 2', rotation: 2 },
    { src: photoUrls[2], alt: 'Our memory 3', rotation: -2 },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {[0, 1, 2].map((index) => (
          <Card
            key={index}
            className="animate-pulse border-8 border-white bg-rose-100 shadow-xl"
            style={{
              width: '200px',
              height: '240px',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
      {photos.map((photo, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden border-8 border-white bg-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
          style={{
            transform: `rotate(${photo.rotation}deg)`,
            width: '200px',
            height: '240px',
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <img
              src={photo.src}
              alt={photo.alt}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage: 'url(/assets/generated/polaroid-frame.dim_1200x1200.png)',
              }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
