import { Button } from "@/app/design";
import { useRouter } from "next/navigation";

export default function NavigateButton({ isPending }: { isPending: boolean }) {
  const router = useRouter();

  const handleNext = () => {
    router.push("/auth/2fa-verify");
  };

  return (
    <div className="text-center">
      <Button
        variant="primary"
        size="md"
        style={{
          marginLeft: "-10px",
        }}
        onClick={handleNext}
        disabled={isPending}
        rightIcon="→"
      >
        I&apos;ve scanned the QR code
      </Button>
    </div>
  );
}
