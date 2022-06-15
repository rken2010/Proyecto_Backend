import mongoose from 'mongoose'

conexionMongo()

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
   
}

  /*----------------- SCHEMA PRODUCTOS -------------------*/
  /*---Colecciones---*/
const productosCollection = "Productos";

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

  class contenedorMongo {
    constructor(nombreColeccion) {
      this.nombreColeccion = nombreColeccion;
      this.modelo = mongoose.model(nombreColeccion, ProductosSchema);
    }
    async listarAll() {
      const items = await this.modelo.find();
      return items;
    }
    async listar(id) {
      const item = await this.modelo.findById(id);
      return item;
    }
    async guardar(item) {
      const nuevoItem = new this.modelo(item);
      await nuevoItem.save();
    }
    async borrar(id) { 
        await this.modelo.findByIdAndDelete(id);
    }
    async actualizar(id, item) {
      await this.modelo.findByIdAndUpdate(id, item);
    }
    }

    export default contenedorMongo;