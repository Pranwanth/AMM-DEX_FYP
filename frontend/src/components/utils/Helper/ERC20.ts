import { ethers } from 'ethers';

interface ApprovalRequest {
  contractAddress: string;
  spenderAddress: string;
  amount: string; // The amount as a string, to be parsed later
}

const ERC20ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
];

async function getTokenContract(contractAddress: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, ERC20ABI, signer);
}

export async function approveERC20({ contractAddress, spenderAddress, amount }: ApprovalRequest, amountInBigInt?: boolean): Promise<ethers.ContractTransaction> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("Ethereum provider (e.g., MetaMask) is not available.");
  }
  const amountParam = amountInBigInt ? ethers.toBigInt(amount) : ethers.parseUnits(amount, 18)
  const tokenContract = await getTokenContract(contractAddress)
  const tx = await tokenContract.approve(spenderAddress, amountParam);
  await tx.wait(); // Wait for the transaction to be mined

  return tx;
}

export async function approveMultipleERC20(approvalRequests: ApprovalRequest[]): Promise<ethers.ContractTransaction[]> {
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