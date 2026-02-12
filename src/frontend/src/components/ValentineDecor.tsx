export default function ValentineDecor() {
  return (
    <>
      {/* Background pattern */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url(/assets/generated/valentine-bg.dim_1920x1080.png)',
        }}
      />

      {/* Glitter overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-20 mix-blend-screen"
        style={{
          backgroundImage: 'url(/assets/generated/glitter-overlay.dim_1920x1080.png)',
        }}
      />

      {/* Heart stickers */}
      <div
        className="pointer-events-none fixed left-10 top-20 z-0 h-32 w-32 animate-float bg-contain bg-no-repeat opacity-40"
        style={{
          backgroundImage: 'url(/assets/generated/heart-stickers.dim_1024x1024.png)',
          backgroundPosition: '0 0',
        }}
      />
      <div
        className="pointer-events-none fixed right-10 top-40 z-0 h-32 w-32 animate-float bg-contain bg-no-repeat opacity-40"
        style={{
          backgroundImage: 'url(/assets/generated/heart-stickers.dim_1024x1024.png)',
          backgroundPosition: '-128px 0',
          animationDelay: '1s',
        }}
      />
      <div
        className="pointer-events-none fixed bottom-20 left-20 z-0 h-32 w-32 animate-float bg-contain bg-no-repeat opacity-40"
        style={{
          backgroundImage: 'url(/assets/generated/heart-stickers.dim_1024x1024.png)',
          backgroundPosition: '0 -128px',
          animationDelay: '2s',
        }}
      />
      <div
        className="pointer-events-none fixed bottom-40 right-20 z-0 h-32 w-32 animate-float bg-contain bg-no-repeat opacity-40"
        style={{
          backgroundImage: 'url(/assets/generated/heart-stickers.dim_1024x1024.png)',
          backgroundPosition: '-128px -128px',
          animationDelay: '1.5s',
        }}
      />
    </>
  );
}
