import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./firebase.json'));


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
console.log("Conexión a la Base de Datos correcta")

const db = admin.firestore();

const query = db.collection('carrito');

const carro = await query.add({ timestamp: admin.firestore.FieldValue.serverTimestamp() , products: [ {
  "title": "cuaderno",
  "price": 125,
  "thumbnail": "www.google,com",
  "id": 1,
  "timestamp": 1653431559518
}] });