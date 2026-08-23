export default function ProfileImageFrame({ src }: { src: string | null }) {
  return (
    <div className="animate-scale-in [animation-delay:100ms]">
      <div className="profile-image-frame flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border-strong bg-bg-raised transition-colors duration-300">
        {src ? (
          <img
            src={src}
            alt="Professional profile"
            className="profile-image h-full rounded-2xl object-contain transition-transform duration-300"
          />
        ) : (
          <p className="px-4 text-center font-mono text-xs text-text-faint">[ professional photo ]</p>
        )}
      </div>
    </div>
  );
}
