import { create } from "zustand";

interface ModalState {
  isConnectionModalOpen: boolean;
  openConnectionModal: () => void;
  closeConnectionModal: () => void;
  toggleConnectionModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isConnectionModalOpen: false,
  openConnectionModal: () => set({ isConnectionModalOpen: true }),
  closeConnectionModal: () => set({ isConnectionModalOpen: false }),
  toggleConnectionModal: () =>
    set((state) => ({ isConnectionModalOpen: !state.isConnectionModalOpen })),
}));
