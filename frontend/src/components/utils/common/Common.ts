import { ethers } from "ethers";

export const ETHER_BIGINT_ZERO = ethers.toBigInt(0);

export const formatEthersBigint = (value: bigint): string => ethers.formatUnits(value, 18);