import { create } from "zustand";

const useTokenStore = create((set, get) => ({
  tokens: { pay: "ETH", receive: null },
  tokenType: null,
  isModalOpen: false,
  setIsModalOpen: (bool) =>
    set((state) => ({
      isModalOpen: bool,
    })),
  setTokenType: (tokenType) =>
    set((state) => ({
      tokenType,
    })),
  setTokens: (type, token) =>
    set((state) => ({
      tokens: {
        ...get().tokens,
        [type]: token,
      },
    })),
  swapTokens: () =>
    set((state) => ({
      tokens: {
        pay: get().tokens.receive,
        receive: get().tokens.pay,
      },
    })),
}));

export default useTokenStore;
