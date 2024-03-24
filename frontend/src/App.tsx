import "./global.css";

import Navbar from "./components/Navbar/Navbar";
import Swap from "./pages/Swap";
import SelectTokenModal from "./components/SelectTokenModal/SelectTokenModal";
import useTokenStore from "./store/useTokenStore";
import { Route, Routes } from "react-router-dom";
import Pool from "./pages/Pool";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import AddLiquidityTab from "./components/Pool/AddLiquidityTab";
import RemoveLiquidityTab from "./components/Pool/RemoveLiquidityTab";

const App = () => {
  const { isModalOpen } = useTokenStore();
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <main className="flex flex-col w-screen h-screen bg-primaryBackground font-body relative">
          {isModalOpen && (
            <div className="w-screen h-screen bg-black/20 absolute z-10" />
          )}
          <Navbar />
          <Routes>
            <Route path="/" element={<Swap />} />
            <Route path="/pool" element={<Pool />} />
            <Route path="/add" element={<AddLiquidityTab />} />
            <Route path="/remove" element={<RemoveLiquidityTab />} />
          </Routes>
          {isModalOpen && <SelectTokenModal />}
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
