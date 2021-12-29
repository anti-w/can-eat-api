const fs = require('firebase-admin') //firebase admin
const serviceAccount = require('./firebase/authService.json') //chave-key gerada no site do firebase

const connectDb = fs.initializeApp({
  credential: fs.credential.cert(serviceAccount)
}) //inicializando o App do firebase com as credenciais do projeto definidas em modo teste


module.exports = connectDb