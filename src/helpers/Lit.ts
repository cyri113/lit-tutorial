import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_CHAINS, LitNetwork } from "@lit-protocol/constants";
import type { AccsDefaultParams } from "@lit-protocol/types";
import {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { Account, Chain, Client, Transport } from "viem";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { config } from "../wagmi";
import { getBlock } from "wagmi/actions";

type LitChain = AccsDefaultParams["chain"];

let litNodeClient: LitNodeClient

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
  litNodeClient = new LitNodeClient({ litNetwork: LitNetwork.Manzano })
  await litNodeClient.connect()
  return litNodeClient;
}

export const getSessionSignatures = async (client: Client<Transport, Chain, Account> ) => {

  // Connector Client => Signer (ether.js compatibility)
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)

  // Get the latest blockhash
  const latestBlockhash = await getBlock(config, { blockTag: 'latest' })

  // Define the authNeededCallback function
  const authNeededCallback = async(params: { uri: any; expiration: any; resourceAbilityRequests: any; } | undefined) => {
    if (!params.uri) {
      throw new Error("uri is required");
    }
    if (!params.expiration) {
      throw new Error("expiration is required");
    }

    if (!params.resourceAbilityRequests) {
      throw new Error("resourceAbilityRequests is required");
    }

    // Create the SIWE message
    const toSign = await createSiweMessageWithRecaps({
      uri: params.uri,
      expiration: params.expiration,
      resources: params.resourceAbilityRequests,
      walletAddress: account.address,
      nonce: latestBlockhash.nonce,
      litNodeClient: client,
    });

    // Generate the authSig
    const authSig = await generateAuthSig({
      signer,
      toSign,
    });

    return authSig;
  }

  // Define the Lit resource
  const litResource = new LitAccessControlConditionResource('*');

  const resourceAbilityRequests = [
    {
        resource: litResource,
        ability: LitAbility.AccessControlConditionDecryption,
    },
  ]

  // Get the session signatures
  const sessionSigs = await litNodeClient.getSessionSigs({
      chain: chain.name,
      authNeededCallback: authNeededCallback({ uri: 'http://localhost:5173/', expiration: 'never', resourceAbilityRequests }),
  });
  return sessionSigs;
}
