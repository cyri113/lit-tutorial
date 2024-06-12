import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { EncryptToJsonPayload } from "@lit-protocol/types"
import { useState } from "react";
import useLit from "./hooks/LitProvider";
import useSessionSigs from "./hooks/useSessionSigs";
import { useEthersSigner } from "./hooks/useEthersSigner";
import { useAccount } from "wagmi";

interface IDecrypt {
  parsedJsonData: EncryptToJsonPayload | undefined
  chain: string | undefined
}

function Decrypt({ parsedJsonData, chain }: IDecrypt) {
  const { litNodeClient } = useLit()
  const signer = useEthersSigner()
  const { chainId } = useAccount()
  const { sessionSigs, createSessionSigs } = useSessionSigs()
  const [decryptedString, setDecryptedString] = useState<string | undefined>()


  const decrypt = async () => {
    if (!parsedJsonData) {
      throw new Error("Undefined parsedJsonData");
    }
    if (!sessionSigs) {
      throw new Error("Undefined sessionSigs");
    }
    if (!chain) {
      throw new Error("Undefined chain");
    }

    const str = await LitJsSdk.decryptFromJson({
      litNodeClient, parsedJsonData, sessionSigs
    })
    setDecryptedString(str)
  }

  return (
    <>
      <div>
        <div>parsedJsonData:</div>
        <code>{JSON.stringify(parsedJsonData)}</code>
      </div>

      {signer && chainId ?
        <div>
          <button onClick={() => createSessionSigs({ signer, chainId, litNodeClient })}>Create SessionSigs</button>
          <code>{JSON.stringify(sessionSigs)}</code>
        </div> : <></>}

      {sessionSigs && parsedJsonData ?
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