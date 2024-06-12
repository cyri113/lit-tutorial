import { LIT_CHAINS } from "@lit-protocol/constants";
import type { AccsDefaultParams } from "@lit-protocol/types";

type LitChain = AccsDefaultParams["chain"];

// Map a chainId to a Lit chain name via `LIT_CHAINS`
export const chainIdToLitChainName = (chainId: number): LitChain | undefined => {
  console.log(LIT_CHAINS)
  for (const [name, chain] of Object.entries(LIT_CHAINS)) {
    if (chain.chainId === chainId) {
      return name as LitChain;
    }
  }
  return 'hardhat';
  // return undefined;
};