const firebase = require('./connectDB')
const alimentosRef = firebase.firestore().collection("alimentos")
const gruposRef = firebase.firestore().collection('grupos')
const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())



app.get('/alimentos', async (req, res) => {

  const snapshot = await alimentosRef.orderBy('Nome').get();
  const allData = []
  snapshot.forEach(doc => {
    allData.push(doc.data())
  });
  res.send(allData)
})

app.get('/groups', async (req, res) => {

  const snapshot = await gruposRef.orderBy('nome').get();
  const allData = []
  snapshot.forEach(doc => {
    allData.push(doc.data())
  });
  res.send(allData)
})

app.get('/:id', async (req, res) => {
  const result = await alimentosRef.doc(req.params.id).get()
  res.json(result.data())

})



app.listen(port, () => {
  console.log(`App rodando! Acesse: http://localhost:${port}`)
})