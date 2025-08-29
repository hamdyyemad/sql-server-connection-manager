import RefreshIcon from "@/app/design/svg/refresh-icon";

export default function QRCodeRegenerateBtn({
  onRegenerate,
  isRegenerating,
}: {
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  return (
    <button
      onClick={onRegenerate}
      disabled={isRegenerating}
      className="absolute -top-2 -right-2 p-2 bg-gray-100 hover:scale-110 hover:rotate-180 border border-gray-200 rounded-full shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      title="Regenerate QR Code"
    >
      <RefreshIcon className="w-4 h-4 text-gray-900" />
    </button>
  );
}
