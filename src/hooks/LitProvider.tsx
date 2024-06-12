import { ReactElement, createContext, useContext, useEffect, useMemo, useState } from "react"
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";

interface ILitProvider {
  litNetwork: LitNetwork
  children: ReactElement
}

const defaultLitNodeClient = new LitNodeClient({ litNetwork: LitNetwork.Habanero })
const LitClientContext = createContext({
  litNodeClient: defaultLitNodeClient,
  litConnected: false,
});


export const LitProvider = ({ litNetwork, children }: ILitProvider) => {

  const client = useMemo(() => new LitNodeClient({ litNetwork }), [])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const connect = async () => {
      try {
        await client.connect()
        setConnected(true)
        console.log(`Connected to Lit Network: ${litNetwork}`)
      } catch (error) {
        console.error(error)
        setConnected(false)
      }
    }
    connect()
  })

  return (
    <LitClientContext.Provider value={{ litNodeClient: client, litConnected: connected }}>{children}</LitClientContext.Provider>
  )
}

export default function useLit() {
  return useContext(LitClientContext)
}