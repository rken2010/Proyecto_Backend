const { promises: fs } = require('fs')

class Contenedor {

    constructor(archivo) {
        this.archivo = archivo;
    }

    async listarAll() {
        try {
            const items = await fs.readFile(this.archivo, 'utf-8')
            return JSON.parse(items)
        } catch (error) {
            return []
        }
    }

    async listar(id) {
        const items = await this.listarAll()
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
            await fs.writeFile(this.archivo, JSON.stringify(items, null, 2))
            return newId
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async actualizar(elem, id) {
        const items = await this.listarAll()
        const index = items.findIndex(o => o.id == id)
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${id}`)
        } else {
            items[index] = elem
            try {
                await fs.writeFile(this.archivo, JSON.stringify(items, null, 2))
            } catch (error) {
                throw new Error(`Error al borrar: ${error}`)
            }
        }
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

    async agregarProducto( id , id_prod) {
        const carrito = await this.listar( id )
        const producto = await this.listar ( id_prod)
        carrito.items.push( producto);

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

module.exports = Contenedor;