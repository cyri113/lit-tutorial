import { useForm } from "react-hook-form";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AccessControlConditions } from "@lit-protocol/types";
import { useAccount } from "wagmi";
import useLit from "./hooks/LitProvider";

interface IEncrypt {
  setParsedJsonData: any
  chain: string | undefined
}

function Encrypt({ setParsedJsonData, chain }: IEncrypt) {
  const { register, handleSubmit } = useForm()
  const { address } = useAccount()
  const { litNodeClient, litConnected } = useLit()

  const onSubmit = async (data: any) => {
    await encrypt(data)
  }

  function generateAccessControlConditions(): AccessControlConditions {
    return [{
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [
        ':userAddress',
      ],
      returnValueTest: {
        comparator: '=',
        value: address
      },
    }]
  }

  async function encrypt(dataToEncrypt: any): Promise<void> {

    if (!chain) {
      throw new Error("Undefined chain.");
    }

    const accessControlConditions = generateAccessControlConditions()

    if (litConnected) {
      try {
        console.log('Encrypting...')
        const encryptResponse = await LitJsSdk.encryptToJson({
          string: JSON.stringify(dataToEncrypt),
          accessControlConditions, litNodeClient, chain,
        })
        console.log('Encrypted :)')
        const json = JSON.parse(encryptResponse)
        setParsedJsonData(json)
      } catch (error) {
        console.error(error)
      }
    } else {
      throw new Error("Lit must be connected.");
    }
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>Message</div>
          <input defaultValue="secret" {...register("message")} />
        </div>
        <input type="submit" />
      </form>
    </>
  )
}

export default Encrypt