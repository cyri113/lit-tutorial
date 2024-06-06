import { useEffect, useState } from "react"
import Encrypt from "./Encrypt"
import Decrypt from "./Decrypt"

function LitProtocol() {
  const [encryptResponse, setEncryptResponse] = useState()
  const [accessControlConditions, setAccessControlConditions] = useState()

  useEffect(() => {
    console.log('encryptResponse', encryptResponse)
  }, [encryptResponse])

  return (
    <>
      <div>
        <h2>Encrypt</h2>
        <Encrypt setEncryptResponse={setEncryptResponse} setAccessControlConditions={setAccessControlConditions} />
      </div>
      <div>
        <h2>Decrypt</h2>
        <Decrypt encryptResponse={encryptResponse} accessControlConditions={accessControlConditions} />
      </div>
    </>
  )


}

export default LitProtocol