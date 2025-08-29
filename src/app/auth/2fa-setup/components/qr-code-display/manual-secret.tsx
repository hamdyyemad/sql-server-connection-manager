export default function ManualSecret({ secret }: { secret: string }) {
  return (
    <>
      <p className="text-sm text-gray-400 mb-2 text-center w-full px-4">
        Scan this QR code with your authenticator app
      </p>
      <div className="bg-gray-800 p-3 rounded-lg w-full max-w-md mx-auto px-4 mb-4">
        <p className="text-xs text-gray-400 mb-1 text-center">
          Manual entry code:
        </p>
        <p className="text-white font-mono text-sm break-all text-center">
          {secret}
        </p>
      </div>
    </>
  );
}
