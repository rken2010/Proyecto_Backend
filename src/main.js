import express from 'express';
import Contenedor from './Contenedor.js';
const app = express(); // declaro la app //
const { Router } = express // Exporto el Router de Express//


// VARIABLE ADMIN //

let admin = true;

// CONTENEDORES   //


const catalogo = new Contenedor("src/contenedores/catalogo.json")
const carrito = new Contenedor ( "./src/contenedores/compras.json")

// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))



// ROUTERS //

const routerProductos = new Router ()
const routerCarrito = new Router()

//Carga de Routers //

app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)


// ROUTER PRODUCTOS //

    //GET //

    routerProductos.get('/', async (req, res) => {
      const items = await catalogo.listarAll()
      res.json(items);
  });
  
      //GET X ID //
  
  routerProductos.get("/:id", async (req, res) =>{
    const productoPorId = await catalogo.listar( req.params.id )
    res.send( productoPorId )
  })
  
       //POST//
routerProductos.post("/",  (req, res) =>{
  if ( !admin) { return "error 401" }
  const productoNuevo = req.body
  catalogo.guardar( productoNuevo)
  res.send( "carga correcta" )
})

      //PUT//

  routerProductos.put("/:id", async (req, res) =>{
    if ( !admin) { return "error 401" }
    const productoActualizado = req.body
    catalogo.actualizar( productoActualizado, req.params.id)
    res.send( "actualizado correctamente" )
  })

      //DELETE //
routerProductos.delete("/:id", async ( req, res ) => {
  if ( !admin) { return "error 401" }
  await catalogo.borrar( req.params.id )
  res.send( "borrado correcto" )
})


//ROUTER CARRITO//

 //GET //

 routerCarrito.get('/', async (req, res) => {
  const items = await carrito.listarAll()
  res.json(items);
});

  //GET X ID //

  routerCarrito.get("/:id", async (req, res) =>{
const carritoPorId = await carrito.listar( req.params.id )
res.send( carritoPorId )
})

   //POST//
   routerCarrito.post("/",  (req, res) =>{
  const carritoNuevo =  carrito.guardar( req.body )
  console.log(carritoNuevo);
  res.send( `carga correcta, su carrito tienen el ID: ${ carritoNuevo.id }` )
  })

  routerCarrito.post("/:id/productos/:id_prod",  (req, res) =>{
    const { id , id_prod } = req.params
    carrito.agregarProducto( id , id_prod)
    res.send( "producto cargado correctamente" )
    })

  //DELETE //
  routerCarrito.delete("/:id", async ( req, res ) => {
await carrito.borrar( req.params.id )
res.send( "borrado correcto" )
})

routerCarrito.delete("/:id/productos/:id_prod", async ( req, res ) => {
  const { id , id_prod } = req.params 
  carrito.borrarProducto( id , id_prod)
  res.send( "borrado correcto" )
  })

 




// PONGO A ESCUCHAR AL SERVER //

const PORT = process.env.PORT || 8080 // declaro el puerto a usar //

const server = app.listen(PORT, () => {
    console.log('Servidor HTTP escuchando en el puerto ' + PORT)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
/*

El router base '/api/productos' implementará cuatro funcionalidades:
GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
POST: '/' - Para incorporar productos al listado (disponible para administradores)
PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)
DELETE: '/:id' - Borra un producto por su id (disponible para administradores)

El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores:
POST: '/' - Crea un carrito y devuelve su id.
DELETE: '/:id' - Vacía un carrito y lo elimina.
GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
Crear una variable booleana administrador, cuyo valor configuraremos más adelante con el sistema de login. Según su valor (true ó false) me permitirá alcanzar o no las rutas indicadas.
 En el caso de recibir un request a una ruta no permitida por el perfil, devolver un objeto de error. Ejemplo: { error : -1, descripcion: ruta 'x' método 'y' no autorizada }

Un producto dispondrá de los siguientes campos:  id, timestamp, nombre, descripcion, código, foto (url), precio, stock.
El carrito de compras tendrá la siguiente estructura: 
id, timestamp(carrito), productos: { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }
El timestamp puede implementarse con Date.now()
Realizar la persistencia de productos y del carrito de compras en el filesystem.
*/