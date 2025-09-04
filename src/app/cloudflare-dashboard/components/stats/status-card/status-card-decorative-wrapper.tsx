export default function StatusCardDecorativeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse" />

      {children}
      
      {/* Decorative corner elements */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-slate-400/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-br from-slate-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </>
  );
}
