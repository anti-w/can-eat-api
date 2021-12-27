const firebase = require('./connectDB')
const alimentosRef = firebase.firestore().collection("alimentos")

const express = require('express')
const app = express()
const port = 3000



app.get('/', async (req, res) => {

  const snapshot = await alimentosRef.get();
  const allData = {}
  snapshot.forEach(doc => {
    allData[doc.id] = doc.data();
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