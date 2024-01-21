const Web3 = require('web3')
const express = require('express')
const web = new Web3("http://localhost:8545")
const fs = require('fs')
const cors = require('cors')


const app = express()
app.use(cors())
app.listen(3333)
const json = JSON.parse(fs.readFileSync("../nodo/data/keystore/UTC--2024-01-21T09-08-10.221007463Z--279aea0391fa5ef90cc47aeec763814bf6573f3b.json"))

app.get("/balance/:address", async (req, res) => {
    web.eth.getBalance(req.params.address)
        .then(saldo => {
            res.send(saldo)
        })
        .catch(err => {
            res.send(err)
        })
})

app.get("/send/:address", async(req, res) => {
    const account = await web.eth.accounts.decrypt(json, "password")
    const tx = {
        chainId: 8888,
        to: req.params.address,
        from: account.address,
        gas: 30000,
        value: web.utils.toWei("100", 'ether')
    }
    const txSigned = await account.signTransaction(tx)
    const result = web.eth.sendSignedTransaction(txSigned.rawTransaction)
    res.send(result)
})


