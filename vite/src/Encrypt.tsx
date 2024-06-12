import { useForm } from "react-hook-form";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AccessControlConditions, EvmContractConditions } from "@lit-protocol/types";
import { useAccount } from "wagmi";
import useLit from "./hooks/LitProvider";

// sepolia
const permissionContractAddress = "0x159c58561685F83C09c76FeD3d85C6eca68d8227"
const resourceAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

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

  function generateEvmContractConditions(): EvmContractConditions {
    return [
      {
        contractAddress: permissionContractAddress,
        functionName: "getPermission",
        functionParams: [resourceAddress, ":userAddress"],
        functionAbi: {
          "inputs": [
            {
              "internalType": "address",
              "name": "resource_",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "account_",
              "type": "address"
            }
          ],
          "name": "getPermission",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        chain,
        returnValueTest: {
          key: "",
          comparator: '=',
          value: "true"
        },
      }
    ]
  }

  function generateAccessControlConditions(): AccessControlConditions {
    return [
      {
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
      },
    ]
  }

  async function encrypt(dataToEncrypt: any): Promise<void> {

    if (!chain) {
      throw new Error("Undefined chain.");
    }

    const accessControlConditions = generateAccessControlConditions()
    const evmContractConditions = generateEvmContractConditions()

    if (litConnected) {
      try {
        console.log('Encrypting...')
        const encryptResponse = await LitJsSdk.encryptToJson({
          string: JSON.stringify(dataToEncrypt),
          // accessControlConditions, 
          evmContractConditions,
          litNodeClient,
          chain,
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