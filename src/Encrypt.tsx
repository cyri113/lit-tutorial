import { useForm } from "react-hook-form";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useAccount } from "wagmi";

import { connect, chainIdToLitChainName } from './helpers/Lit'
import { useEffect, useState } from "react";

interface IEncrypt {
  setEncryptResponse: any
  setAccessControlConditions: any
}

function Encrypt({
  setEncryptResponse, setAccessControlConditions
}: IEncrypt) {
  const { register, handleSubmit } = useForm()
  const { chainId, address } = useAccount()
  const [litChainName, setLitChainName] = useState()

  useEffect(() => {
    if (chainId) {
      setLitChainName(chainIdToLitChainName(chainId))
    }
  }, [chainId])


  const onSubmit = async (data: any) => {
    console.log(data)
    const encryptReponse = await encrypt(data.message, data.accounts)
    setEncryptResponse(encryptReponse)
  }

  function generateAccessControlConditions(str: string) {
    const accounts: string[] = str.split(", ")
    accounts.push(address as string)

    const interleave = (arr: any[], x: any) => arr.flatMap(e => [e, x]).slice(0, -1)

    const accessControlConditions = accounts.map((account) => ({
      contractAddress: "",
      standardContractType: "",
      chain: litChainName,
      method: "",
      parameters: [
        ':userAddress',
      ],
      returnValueTest: {
        comparator: '=',
        value: account
      },
    }))

    return interleave(accessControlConditions, { operator: 'or' })
  }

  async function encrypt(dataToEncrypt: any, accountStr: string) {
    const client = await connect()

    const accessControlConditions = generateAccessControlConditions(accountStr)
    setAccessControlConditions(accessControlConditions)

    console.log('encrypting...')
    return LitJsSdk.encryptString({
      accessControlConditions, dataToEncrypt
    }, client)
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>Message</div>
          <input defaultValue="secret" {...register("message")} />
        </div>
        <div>
          <div>Receipients</div>
          <input placeholder="0x0000000000000000000000000000000000000000" {...register("accounts")} />
        </div>
        <input type="submit" />
      </form>
    </>
  )
}

export default Encrypt