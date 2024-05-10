import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { WagmiProvider } from "wagmi";

import Navbar from "./components/Navbar/Navbar";
import AddLiquidityTab from "./components/Pool/AddLiquidityTab";
import RemoveLiquidityTab from "./components/Pool/RemoveLiquidityTab";
import SelectTokenModal from "./components/SelectTokenModal/SelectTokenModal";
import { buildTokenGraph } from "./components/utils/helper";
import { config } from "./config";
import "./global.css";
import Pool from "./pages/Pool";
import Swap from "./pages/Swap";
import useTokenGraphStore from "./store/useTokenGraphStore";
import useTokenStore from "./store/useTokenStore";

const App = () => {
  const { isModalOpen } = useTokenStore();
  const setTokenGraph = useTokenGraphStore(state => state.setTokenGraph);
  const queryClient = new QueryClient();

  useEffect(() => {
    const initializeGraph = async () => {
      const graph = await buildTokenGraph();
      setTokenGraph(graph);
    };

    initializeGraph();
  }, [setTokenGraph])


  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <main className="flex flex-col w-screen min-h-screen bg-primaryBackground relative scrollbar-hide">
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
          <ToastContainer newestOnTop />
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
