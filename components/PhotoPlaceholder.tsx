type Props = {
  className?: string;
  tint?: string;
};

export default function PhotoPlaceholder({ className = "", tint }: Props) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden washed ${className}`}
      style={{
        background: tint
          ? `repeating-linear-gradient(135deg, ${tint} 0 10px, color-mix(in srgb, ${tint} 60%, transparent) 10px 20px)`
          : "repeating-linear-gradient(135deg, var(--color-neutral-300) 0 10px, var(--color-neutral-200) 10px 20px)",
      }}
    >
      <span className="text-[9px] font-semibold tracking-[.06em] text-neutral-600">
        PHOTO
      </span>
    </div>
  );
}
