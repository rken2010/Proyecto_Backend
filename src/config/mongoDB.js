const mongoose = require('mongoose');


conexionMongo ();


async function conexionMongo() {

  /* -------------- DB MONGO ATLAS ------------------- */
  
    try{
        const uri = "mongodb+srv://coderhouse:coderhouse@cluster0.qik4m.mongodb.net/?retryWrites=true&w=majority";
        let conexion = await mongoose.connect(  uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } ) 
        console.log( "Conexión a la Base de Datos establecida")
            }
    catch(error){ console.log(error) }
    finally{
        await mongoose.disconnect()
        console.log("Conexión a la Base de Datos finalizada")
    }
}

  /*----------------- SCHEMA PRODUCTOS -------------------*/
  /*---Colecciones---*/
const productosCollection = "Productos";
const carritoCollection = "Carrito";
  /*---Schemas---*/
 const ProductosSchema = new mongoose.Schema( {
   timestamp:{ type: Date },
   title: { type: String, require: true, max:100},
   description: { type: String, require: true, max:100},
   code: { type: Number, require: true },
   thumnail: { type: String, require: true},
   price: { type: Number, require: true },
   stock: { type: Number, require: true },
 })
  const CarritoSchema = new mongoose.Schema( {
    timestamp:{ type: Date },
    products: [ ProductosSchema ],
  }) 

  exports.Productos = mongoose.model( productosCollection, ProductosSchema );
  exports.Carrito = mongoose.model( carritoCollection, CarritoSchema );