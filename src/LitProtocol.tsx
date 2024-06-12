import Encrypt from "./Encrypt"
import Decrypt from "./Decrypt"
import { useEffect, useState } from "react"
import { chainIdToLitChainName } from "./helpers/Lit"
import { useAccount } from "wagmi"

function LitProtocol() {

  const { chainId } = useAccount()
  const [chain, setChain] = useState<string>()
  const [payload, setPayload] = useState()

  useEffect(() => {
    if (chainId) {
      const chainName = chainIdToLitChainName(chainId)
      setChain(chainName)
    }
  }, [chainId])

  useEffect(() => {
    console.log("payload", payload)
  }, [payload])

  return (
    <>
      <div>
        <h2>Encrypt</h2>
        <Encrypt setPayload={setPayload} chain={chain} />
      </div>
      <div>
        <h2>Decrypt</h2>
        <Decrypt payload={payload} chain={chain} />
      </div>
    </>
  )


}

export default LitProtocol