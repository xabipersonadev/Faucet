import { useEffect, useState } from 'react'

function App() {
  const [cuenta, setCuenta] = useState(0)
  const [saldo, setSaldo] = useState(null)
  const [tx, setTx] = useState(0)
  useEffect(() => {
    window.ethereum.request({
      method: "eth_requestAccounts"
    }).then(cuentas => {
      setCuenta(cuentas[0]) 
      window.ethereum.on("accountsChanged", (cuentas) => {
        setCuenta(cuentas[0])
      })
    })
  }, [])

  useEffect(() => {
    if (cuenta != null && cuenta != 0) {
      getSaldo()
    }
  }, [cuenta])

  useEffect(() => {
    if (cuenta != null && cuenta != 0 && saldo != null && saldo != 0) {
      getSaldo()
    }
  }, [saldo])

  async function sendCoins(){
    const response = await fetch(`http://localhost:3333/send/${cuenta}`)
    const result = await response.json()
    setTx(result)
  }

  async function getSaldo() {
    const result = await fetch(`http://localhost:3333/balance/${cuenta}`)
    const sal = await result.json()
    setSaldo(sal)
  }

  return (
    <div>
      <h1>La cuenta: {cuenta}</h1>
      <div>Saldo: {saldo}</div>
      <button onClick={() => sendCoins()}>Send 100 coins!</button>
      <div>{JSON.stringify(tx, null, 4)}</div>
    </div>
  )
}

export default App
