import { create } from "zustand";

interface SettingStore {
  swapSlippage: number
  addLiquiditySlippage: number
  swapDeadline: number
  addLiquidityDeadline: number
  setSwapSlippage: (slippage: number) => void
  setAddLiquiditySlippage: (slippage: number) => void
  setSwapDeadline: (deadline: number) => void
  setAddLiquidityDeadline: (deadline: number) => void
}

const useSettingStore = create<SettingStore>()((set) => ({
  swapSlippage: 0.5,
  addLiquiditySlippage: 0.5,
  swapDeadline: 10,
  addLiquidityDeadline: 10,
  setSwapSlippage: (slippage) => set({ swapSlippage: slippage }),
  setAddLiquiditySlippage: (slippage) => set({ addLiquiditySlippage: slippage }),
  setSwapDeadline: (deadline) => set({ swapDeadline: deadline }),
  setAddLiquidityDeadline: (deadline) => set({ addLiquidityDeadline: deadline })
}));

export default useSettingStore;
