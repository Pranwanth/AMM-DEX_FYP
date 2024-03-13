import { create } from "zustand";

interface token {
  pay: string | null
  receive: string | null
}

interface TokenStore {
  tokens: token
  tokenType: string | null
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  setTokenType: (tokenType: string) => void
  setTokens: (type: string | null, token: string) => void
  swapTokens: () => void
}

const useTokenStore = create<TokenStore>()((set, get) => ({
  tokens: { pay: "ETH", receive: null },
  tokenType: null,
  isModalOpen: false,
  setIsModalOpen: (open) => set({ isModalOpen: open }),
  setTokenType: (tokenType) => set({ tokenType: tokenType }),
  setTokens: (type, token) =>
    set({
      tokens: {
        ...get().tokens,
        ...(type && { [type]: token })
      }
    }),
  swapTokens: () =>
    set({
      tokens: {
        pay: get().tokens.receive,
        receive: get().tokens.pay,
      },
    }),
}));

export default useTokenStore;
