import { ethers } from "ethers";
import { useCallback, useState } from "react";

// Define the parameters your hook will use, you might want to pass these dynamically or define them within.
interface UseERC20ApproveProps {
  contractAddress: string;
  spenderAddress: string;
  amount: string; // The amount as a string, to be parsed later
}

export const useERC20Approve = ({ contractAddress, spenderAddress, amount }: UseERC20ApproveProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approve = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Check if MetaMask is available
    if (typeof window.ethereum === 'undefined') {
      const metamaskNotAvailableError = new Error("MetaMask is not available. Please install MetaMask.");
      setError(metamaskNotAvailableError);
      setLoading(false);
      throw metamaskNotAvailableError;
    }

    try {
      // Assuming MetaMask is available
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const ERC20ABI = [
        "function approve(address spender, uint256 amount) public returns (bool)",
      ];

      const tokenContract = new ethers.Contract(contractAddress, ERC20ABI, signer);
      const tx = await tokenContract.approve(spenderAddress, ethers.parseUnits(amount, 18)); // Assuming token has 18 decimals
      await tx.wait();

      setLoading(false);
      return tx;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  }, [contractAddress, spenderAddress, amount]);

  return { approve, loading, error };
};
