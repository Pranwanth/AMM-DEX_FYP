import { create } from "zustand";
import { TokenGraph } from "../components/utils/helper";


interface TokenGraphStore {
  tokenGraph: TokenGraph | null
  setTokenGraph: (graph: TokenGraph) => void
}

const useTokenGraphStore = create<TokenGraphStore>()((set) => ({
  tokenGraph: null,
  setTokenGraph: (graph) => set({ tokenGraph: graph })
}));

export default useTokenGraphStore;
