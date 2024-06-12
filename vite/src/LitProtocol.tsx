import Encrypt from "./Encrypt"
import Decrypt from "./Decrypt"
import { useEffect, useState } from "react"
import { chainIdToLitChainName } from "./helpers/Lit"
import { useAccount } from "wagmi"
import { EncryptToJsonPayload } from '@lit-protocol/types'

function LitProtocol() {

  const { chainId } = useAccount()
  const [chain, setChain] = useState<string>()
  const [parsedJsonData, setParsedJsonData] = useState<EncryptToJsonPayload | undefined>()

  useEffect(() => {
    if (chainId) {
      const chainName = chainIdToLitChainName(chainId)
      setChain(chainName)
    }
  }, [chainId])

  return (
    <>
      <div>
        <h2>Encrypt</h2>
        <Encrypt setParsedJsonData={setParsedJsonData} chain={chain} />
      </div>
      <div>
        <h2>Decrypt</h2>
        <Decrypt parsedJsonData={parsedJsonData} chain={chain} />
      </div>
    </>
  )


}

export default LitProtocol