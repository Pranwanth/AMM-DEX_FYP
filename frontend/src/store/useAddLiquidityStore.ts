import { create } from "zustand";
import { Token } from "../components/GlobalTypes";

interface AddLiquidityStore {
  addTokenA: Token | undefined
  addTokenB: Token | undefined
  setAddTokenA: (token: Token) => void
  setAddTokenB: (token: Token) => void
}

const useAddLiquidityStore = create<AddLiquidityStore>()((set) => ({
  addTokenA: undefined,
  addTokenB: undefined,
  setAddTokenA: (token) => set({ addTokenA: token }),
  setAddTokenB: (token) => set({ addTokenB: token }),
}));

export default useAddLiquidityStore;
