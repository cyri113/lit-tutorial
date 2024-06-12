import { useForm } from "react-hook-form";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AccessControlConditions } from "@lit-protocol/types";
import { useAccount } from "wagmi";
import useLit from "./hooks/LitProvider";

interface IEncrypt {
  setPayload: any
  chain: string | undefined
}

function Encrypt({ setPayload, chain }: IEncrypt) {
  const { register, handleSubmit } = useForm()
  const { address } = useAccount()
  const { litNodeClient, litConnected } = useLit()

  const onSubmit = async (data: any) => {
    console.log(data)
    await encrypt(data.message)
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

  async function encrypt(dataToEncrypt: string): Promise<void> {

    const accessControlConditions = generateAccessControlConditions()
    console.log(accessControlConditions)

    if (litConnected) {
      console.log('Encrypting...')
      try {
        const encryptResponse = await LitJsSdk.encryptString({
          dataToEncrypt,
          accessControlConditions
        }, litNodeClient)
        setPayload({
          encryptResponse,
          accessControlConditions,
        })
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