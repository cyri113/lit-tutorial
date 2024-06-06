import { EncryptResponse, AccessControlConditions } from "@lit-protocol/types"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { chainIdToLitChainName, connect } from "./helpers/Lit";
import { useAccount } from "wagmi";

interface IDecrypt {
  encryptResponse: EncryptResponse | undefined
  accessControlConditions: AccessControlConditions
}

function Decrypt({
  encryptResponse,
  accessControlConditions,
}: IDecrypt) {
  const { chainId } = useAccount()
  const { register, handleSubmit } = useForm()
  const [ciphertext, setCiphertext] = useState<string>()
  const [dataToEncryptHash, setDataToEncryptHash] = useState<string>()
  const [litChainName, setLitChainName] = useState<string>()
  const [decryptedString, setDecryptedString] = useState<string>()

  useEffect(() => {
    if (chainId) {
      setLitChainName(chainIdToLitChainName(chainId))
    }
  }, [chainId])

  useEffect(() => {
    if (encryptResponse) {
      setCiphertext(encryptResponse.ciphertext)
      setDataToEncryptHash(encryptResponse.dataToEncryptHash)
    }
  }, [encryptResponse])

  const onSubmit = async (data: any) => {
    console.log(data)
    await decrypt(data.ciphertext, data.dataToEncryptHash)
  }

  async function decrypt(msg: string, hash: string) {
    const client = await connect()

    console.log("accessControlConditions", accessControlConditions)
    console.log("litChainName", litChainName)

    if (accessControlConditions && litChainName) {
      console.log('decrypting...')
      const decryptResponse = await client.decrypt({
        accessControlConditions,
        chain: litChainName,
        ciphertext: msg,
        dataToEncryptHash: hash,
      })
      console.log(decryptResponse)
      // setDecryptedString(decryptedString.decryptedData)
    }

  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>Cipher Text:</div>
          <textarea defaultValue={ciphertext} {...register("ciphertext")} />
        </div>
        <div>
          <div>Data To Encrypt Hash:</div>
          <textarea defaultValue={dataToEncryptHash} {...register("dataToEncryptHash")} />
        </div>
        <div>
          <input type="submit" />
        </div>
      </form>
      <div>
        <div>Decrypted message:</div>
        <div>{decryptedString}</div>
      </div>
    </>
  )
}

export default Decrypt