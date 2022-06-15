import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse( fs.readFileSync("./src/config/firebase.json") );

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
console.log("Conexión a la Base de Datos correcta")

const db = admin.firestore();


class contenedorFirebase {
  constructor ( ) {
    this.carrito = db.collection('carrito');
    
  }

  async listarAll() {
    try {
      const items = await this.carrito.get();
      return items.docs.map(doc => doc.data());
    }
    catch (error) { console.log(error) }
    
  }

  async listar(id) {
    try {
      const items = await (await this.carrito.doc(`${id}`).get());
      return items.data();
     
    }
    catch (error) { console.log(error) }
  }

  async guardar(elem) {
    try {
      const items = await this.carrito.add(elem);
      return items.id;
    }
    catch (error) { console.log(error) }
  }
  async actualizar(id, elem) {
    try {
      const items = await this.carrito.doc(`${id}`).update(elem);
      return items;
    }
    catch (error) { console.log(error) }
  }

  async borrar(id) {
    try {
      const items = await this.carrito.doc(`${id}`).delete();
      return items;
    }
    catch (error) { console.log(error) }
  }

}

export default contenedorFirebase;