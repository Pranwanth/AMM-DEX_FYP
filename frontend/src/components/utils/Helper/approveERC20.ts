import { ethers } from 'ethers';

interface ApprovalRequest {
  contractAddress: string;
  spenderAddress: string;
  amount: string; // The amount as a string, to be parsed later
}

const ERC20ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
];

async function approveERC20({ contractAddress, spenderAddress, amount }: ApprovalRequest): Promise<ethers.ContractTransaction> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("Ethereum provider (e.g., MetaMask) is not available.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const tokenContract = new ethers.Contract(contractAddress, ERC20ABI, signer);
  const tx = await tokenContract.approve(spenderAddress, ethers.parseUnits(amount, 18));
  await tx.wait(); // Wait for the transaction to be mined

  return tx;
}

export default approveERC20
