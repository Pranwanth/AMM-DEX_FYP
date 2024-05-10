import { ethers } from "ethers";

export const ETHER_BIGINT_ZERO = ethers.toBigInt(0);

export const formatEthersBigInt = (value: bigint): string => ethers.formatUnits(value, 18);

/**
 * Sorts two Ethereum addresses in lexicographical order.
 * @param {string} tokenA - The first Ethereum address.
 * @param {string} tokenB - The second Ethereum address.
 * @returns {[string, string]} A tuple with the addresses sorted in lexicographical order.
 * @throws Will throw an error if the addresses are identical or one of them is a zero address.
 */
export function sortTokens(tokenA: string, tokenB: string): [string, string] {
  // Check if addresses are identical
  if (tokenA === tokenB) {
    throw new Error('sortTokens: IDENTICAL_ADDRESSES');
  }

  // Check if any of the addresses is a zero address
  if (tokenA === '0x0000000000000000000000000000000000000000' || tokenB === '0x0000000000000000000000000000000000000000') {
    throw new Error('sortTokens: ZERO_ADDRESS');
  }

  // Sort the tokens lexicographically using < and return in the correct order
  return tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];
}

export function formatToSixSignificantDigits(value: number): number {
  // Convert to scientific notation and split into significant and exponent parts
  const [significant, exponent] = value.toExponential().split('e');

  // Split the significant part into integer and fractional parts
  const [integerPart, fractionalPart] = significant.split('.');

  // Concatenate the integer part with the first five digits of the fractional part
  const truncatedFractional = (fractionalPart || '').substring(0, 5);
  const formattedSignificant = `${integerPart}.${truncatedFractional}`;

  // Reconstruct the number with the exponent and convert back to a float
  const formattedNumber = `${formattedSignificant}e${exponent}`;
  return parseFloat(formattedNumber);
}