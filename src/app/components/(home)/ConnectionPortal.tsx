"use client";
import ConnectionSelector from "./connection-selector";
import ConnectionFormModal from "./modal/ConnectionFormModal";
import { ModalHeader } from "./modal/ModalHeader";
import { useModalStore } from "@/frontend_lib/store/useModalStore";

const ConnectionPortal: React.FC = () => {
  const isOpen = useModalStore((s) => s.isConnectionModalOpen);

  if (!isOpen)
    return (
      <>
        <div className="fixed bottom-6 right-6 z-50">
          <ConnectionSelector />
        </div>
      </>
    );

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-lg mx-4 shadow-2xl overflow-y-auto max-h-full">
        <ModalHeader title="Add SQL Server Connection" />
        <ConnectionFormModal />
      </div>
    </div>
  );
};
export default ConnectionPortal;
