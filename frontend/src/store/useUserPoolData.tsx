import { create } from "zustand";
import { PoolData } from "../components/GlobalTypes";

interface UserPoolDataStore {
  poolData: PoolData | undefined
  setPoolData: (poolData: PoolData) => void
}

const useUserPoolDataStore = create<UserPoolDataStore>()((set) => ({
  poolData: undefined,
  setPoolData(poolData) {
    set({ poolData: poolData })
  },
}));

export default useUserPoolDataStore;
