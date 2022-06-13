const mongoose = require('mongoose');

class ContenedorMongoDB {

    constructor(archivo) {
        this.archivo = archivo;
    }

    async listarAll() {
        try {
            const items = await models.Productos.find()
            return JSON.parse(items)
        } catch (error) {
            return []
        }
        finally{
            mongoose.disconnect()
        }
    }

    async listar(id) {
        const items = await models.Productos.findOne()
        let buscado = items.find(element => element.id  === parseInt(id))
                  if( buscado != null ){ return buscado }
                  else{ return {error: "No se encontro el producto"} }
    }

    async guardar(obj) {
        const items = await this.listarAll()

        let newId
        let timestamp = Date.now()
        if (items.length == 0) {
            newId = 1
        } else {
            newId = items[items.length - 1].id + 1
        }

        const newObj = { ...obj, id: newId, timestamp:timestamp }
        items.push(newObj)

        try {
            await models.Productos.create(newObj)
            return newId
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
        finally{
            await mongoose.disconnect()
            console.log("Conexión a la Base de Datos finalizada")
        }
    }

    async actualizar( id , price) {
      try{
        const productoActualizado = await models.Productos.findOneAndUpdate({id: id}, {price: price})
       console.log("Precio actualizado");
      }
       catch(error) { console.log(error) }
       finally{  mongoose.disconnect()  }  
    }

    async borrar(id) {
        const items = await this.listarAll()
        const index = items.findIndex(o => o.id == id)
        if (index == -1) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`)
        }

        items.splice(index, 1)
        try {
            await fs.writeFile(this.archivo, JSON.stringify(items, null, 2))
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async borrarProducto( id , id_prod) {
        const carrito = await this.listar( id )
        const index = carrito.items.findIndex(o => o.id == id_prod)
        
        if (index == -1) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`)
        }

        carrito.items.splice(index, 1)
        try {
            await fs.writeFile(this.archivo, JSON.stringify(carrito, null, 2))
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

  

    async borrarAll() {
        try {
            await fs.writeFile(this.archivo, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al borrar todo: ${error}`)
        }
    }
}

module.exports = ContenedorMongoDB;