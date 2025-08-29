export default function ConnectionLine() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d="M 100 200 Q 300 100 500 200 T 900 200"
        stroke="url(#lineGradient)"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M 200 300 Q 400 200 600 300 T 1000 300"
        stroke="url(#lineGradient)"
        strokeWidth="1"
        fill="none"
        opacity="0.2"
      />
      <path
        d="M 150 400 Q 350 300 550 400 T 950 400"
        stroke="url(#lineGradient)"
        strokeWidth="1"
        fill="none"
        opacity="0.25"
      />
    </svg>
  );
}
