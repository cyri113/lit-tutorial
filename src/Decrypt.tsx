import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { EncryptResponse, AccessControlConditions } from "@lit-protocol/types"
import { useState } from "react";
import useLit from "./hooks/LitProvider";
import useSessionSigs from "./hooks/useSessionSigs";
import { useEthersSigner } from "./hooks/useEthersSigner";
import { useAccount } from "wagmi";

interface IPayload {
  encryptResponse: EncryptResponse
  accessControlConditions: AccessControlConditions
}

interface IDecrypt {
  payload: IPayload | undefined
  chain: string | undefined
}

function Decrypt({ payload, chain }: IDecrypt) {
  const { litNodeClient } = useLit()
  const signer = useEthersSigner()
  const { chainId } = useAccount()
  const { sessionSigs, createSessionSigs } = useSessionSigs()
  const [decryptedString, setDecryptedString] = useState<string | undefined>()


  const decrypt = async () => {
    if (!payload) {
      throw new Error("Undefined payload");
    }
    if (!sessionSigs) {
      throw new Error("Undefined sessionSigs");
    }
    if (!chain) {
      throw new Error("Undefined chain");
    }

    const { encryptResponse, accessControlConditions } = payload

    const str = await LitJsSdk.decryptToString({
      ...encryptResponse, accessControlConditions, sessionSigs, chain
    }, litNodeClient)
    setDecryptedString(str)
  }

  return (
    <>
      <div>
        <div>encryptResponse:</div>
        <code>{JSON.stringify(payload?.encryptResponse)}</code>
      </div>

      <div>
        <div>accessControlConditions:</div>
        <code>{JSON.stringify(payload?.accessControlConditions)}</code>
      </div>

      {signer && chainId ?
        <div>
          <button onClick={() => createSessionSigs({ signer, chainId, litNodeClient })}>Create SessionSigs</button>
          <code>{JSON.stringify(sessionSigs)}</code>
        </div> : <></>}

      {sessionSigs && payload ?
        <div>
          <button onClick={decrypt}>Decrypt</button>
        </div> : <></>}

      <div>
        <div>Decrypted message:</div>
        <code>{decryptedString}</code>
      </div>
    </>
  )
}

export default Decrypt