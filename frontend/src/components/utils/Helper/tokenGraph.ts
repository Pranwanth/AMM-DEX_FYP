import { getExistingPools, getPoolTokensFromAddress } from './Pool';

export class TokenGraph {
  private adjacencyList: { [token: string]: string[] };

  constructor() {
    this.adjacencyList = {};
  }

  addToken(token: string): void {
    if (!this.adjacencyList[token]) {
      this.adjacencyList[token] = [];
    }
  }

  addPool(token0: string, token1: string): void {
    this.addToken(token0);
    this.addToken(token1);
    this.adjacencyList[token0].push(token1);
    this.adjacencyList[token1].push(token0);
  }

  findPath(startToken: string, endToken: string): string[] {
    const queue: string[] = [startToken];
    const visited: { [token: string]: boolean } = { [startToken]: true };
    const prev: { [token: string]: string | null } = { [startToken]: null };

    while (queue.length) {
      const token = queue.shift()!;
      if (token === endToken) {
        const path: string[] = [];
        let current: string | null = token;
        while (current !== null) {
          path.unshift(current);
          current = prev[current];
        }
        return path;
      }
      this.adjacencyList[token].forEach(neighbor => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          prev[neighbor] = token;
          queue.push(neighbor);
        }
      });
    }
    return []; // no path found
  }
}

export async function buildTokenGraph(): Promise<TokenGraph> {
  const pools = await getExistingPools();
  const graph = new TokenGraph();
  for (const poolAddress of pools) {
    const [token0, token1] = await getPoolTokensFromAddress(poolAddress);
    graph.addPool(token0, token1);
  }
  return graph;
}

export async function findSwapPath(tokenGraph: TokenGraph, tokenA: string, tokenB: string): Promise<string[]> {
  const path = tokenGraph.findPath(tokenA, tokenB);
  if (path.length === 0) {
    return [];
  }
  return path;
}
