export default function GradientCircles() {
  return (
    <>
      <div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"
        style={{ zIndex: 0 }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s", zIndex: 0 }}
      />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "4s", zIndex: 0 }}
      />
    </>
  );
}
