import { ethers } from 'ethers';

interface ApprovalRequest {
  contractAddress: string;
  spenderAddress: string;
  amount: string;
}

const ERC20ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
];

async function approveMultipleERC20(approvalRequests: ApprovalRequest[]): Promise<ethers.ContractTransaction[]> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("Ethereum provider (e.g., MetaMask) is not available.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const transactions: ethers.ContractTransaction[] = [];

  for (const request of approvalRequests) {
    const tokenContract = new ethers.Contract(request.contractAddress, ERC20ABI, signer);
    const tx = await tokenContract.approve(request.spenderAddress, ethers.parseUnits(request.amount, 18));
    await tx.wait(); // Wait for the transaction to be mined
    transactions.push(tx);
  }

  return transactions;
}

export default approveMultipleERC20