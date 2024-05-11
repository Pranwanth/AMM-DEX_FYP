import { create } from "zustand";

interface SettingStore {
  slippage: number,
  deadline: number,
  setSlippage: (slippage: number) => void
  setDeadline: (deadline: number) => void
}

const useSettingStore = create<SettingStore>()((set) => ({
  slippage: 0.5,
  deadline: 10,
  setSlippage: (slippage) => set({ slippage: slippage }),
  setDeadline: (deadline) => set({ deadline: deadline }),
}));

export default useSettingStore;
