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
  const [decryptedData, setDecryptedData] = useState()


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

    try {
      console.log('Decrypting...')
      const str = await LitJsSdk.decryptFromJson({
        litNodeClient, parsedJsonData, sessionSigs
      })
      console.log('Decrypted :)')
      setDecryptedData(JSON.parse(str))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div>
        <div>parsedJsonData:</div>
        <pre>{JSON.stringify(parsedJsonData, null, 2)}</pre>
      </div>

      {signer && chainId ?
        <div>
          <button onClick={() => createSessionSigs({ signer, chainId, litNodeClient })}>Create SessionSigs</button>
          <pre>{JSON.stringify(sessionSigs, null, 2)}</pre>
        </div> : <></>}

      {sessionSigs && parsedJsonData ?
        <div>
          <button onClick={decrypt}>Decrypt</button>
        </div> : <></>}

      <div>
        <div>Decrypted data:</div>
        <pre>{JSON.stringify(decryptedData, null, 2)}</pre>
      </div>
    </>
  )
}

export default Decrypt