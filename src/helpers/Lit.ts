import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_CHAINS, LitNetwork } from "@lit-protocol/constants";
import type { AccsDefaultParams } from "@lit-protocol/types";

type LitChain = AccsDefaultParams["chain"];

let client: LitNodeClient

// Map a chainId to a Lit chain name via `LIT_CHAINS`
export const chainIdToLitChainName = (chainId: number): LitChain | undefined => {
  for (const [name, chain] of Object.entries(LIT_CHAINS)) {
    if (chain.chainId === chainId) {
      return name as LitChain;
    }
  }
  return undefined;
};

export const connect = async (): Promise<LitNodeClient> => {
  client = new LitNodeClient({ litNetwork: LitNetwork.Cayenne })
  await client.connect()
  return client;
}