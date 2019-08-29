const mongoose = require('mongoose');
//localhost:27017 donde tenemos nuestra base de 
//datos mongoDB, en este caso en Local.
//mongo crea la base de datos coche el solo
//este metodo connect nos devuelve una Promesa
//eso quiere decir que podemos utilizar un then
//como vimos en el capitulo de Promesas
mongoose.connect('mongodb://localhost/cars', {useNewUrlParser: true})
    .then(()=>console.log('Conectado a Mongo'))
    .catch(err => console.log('No se ha conectado'))


    /*
    Vamos a definir el esquema de nuestros documentos
    en las colecciones de nuestra base de datos
    mongoDB.
    Basicamente decimos que propiedas tienes
    nuestro documento. Recordar que un documento
    guarda pares de clave-valor y además, en este
    caso se le puede pasar un tipo de byson.
    */

    /*
    https://mongoosejs.com/docs/schematypes.html
    vemos los tipos de datos que nos deja 
    moongose
    */

    const carSchema = new mongoose.Schema({
        company: String, 
        model: String,
        price: Number,
        year: Number,
        sold: Boolean,
        extras: [String], //Array de Strings
        //creamos con fecha de creacion
        date: {type: Date, default: Date.now},
    })

    /*
    Vamos a crear un modelo de nuestro carSchema
    */
//Car -> el nombre de nuestra coleccion en MongoDB
//carSchema -> el Esquema de nuestros coches

//Al llamar a la constante Car en mayuscula
//es por es una clase
const Car = mongoose.model('Car', carSchema)

//vamos a crear una funcion asyncrona como vimos
//cuando vimos el capitulo de promesas y 
//vamos a crear un objeto de la clase car, una instancia
//Recuerda que operaciones de escritura o lectura
//de una base de datos son operaciones asyncronas.
//para ello hemos visto las promeas. Await y sync
async function createCar(){


const car = new Car({
        company: 'BMW', 
        model: 'X7',
        price: 6000,
        year: 2024, 
        sold: true,
        extras: ['4*4', 'Automatic'],
        //no hace falta poner la fecha
})
//Guardar Documento car en Base de Datos
//Dentro de mongosee nos encontramos la operación
//save para guardar un documento en la 
//base de datos.
const result = await car.save();

console.log(result)
}

//createCar()

/*
__v VersionKey es una propiedad establecida en 
cada documento cuando lo creamos con mongosee
Esta vlaor contine la revisión interna de cada
documento. 
*/

//Guardamos dos coches, para ver el ejemplo
//asi que cambiamos el resultado


//Queryn Document
//Leer Documentos.

async function getCars(){
    /*
    Tenemos gran cantidad de metodos para hacer
    una solicutud a una base de datos con mongosee
    como findOne, findById, encojntrar todos
    */
    const cars = await Car.find();
    console.log(cars)
}

//Obtenemos todos los coches de la base de datos
//getCars()

async function getFilterCars(){
    //Podemos Filtrar
    const cars = await Car.find({sold: true, model: 'X7'});
    console.log(cars)
}

//Obtenemos todos los coches de la base de datos
//getFilterCars()

async function getFilterCars2(){
    //Podemos Filtrar
    const cars = await Car
        .find({sold: true, model: 'X7'})
        .sort({price: -1}) //-1 de mayor a menor, +1 de menor a mayor y lo mismo con letras
        .limit(3)
        .select({model: 1, price: 1}) //seleccionamos que propiedade queremos devolver
        console.log(cars)
}

//getFilterCars2();

/*
$eq
$ne
$gt
$gte
$lt
$lte
$in
$nin
*/

async function getFilterPriceCars(){
    //Podemos Filtrar
    const cars = await Car
        //Buscamos los que tenga el precio 2000 justos
        //.find({price: 2000})
        //Ahora buscamos entre 2000 y 10000 y el resto no los queremos.
        .find({price: {$gte: 2000, $lt: 10000}})
        console.log(cars)
}

getFilterPriceCar();

//Or and Ind


async function getFilterOrAndCars(){
    //Podemos Filtrar
    const cars = await Car
        .find()
        .or([{company: 'BMW'}, {model: 'X7'}])
        .or([{company: 'BMW'}, {model: 'X7'}])
        console.log(cars)
}

getFilterOrAndCars();

//Count
async function getCountCars(){
    //Podemos Filtrar
    const cars = await Car
        .find({company: 'BMW'})
        .count()
        console.log(cars)
}

getCountCars();


//Pagination
async function getPaginationCars(){

    const pageNumber = 2;
    const pageSize = 5;
//api/cars?pageNumber=4&pageSize=5
    //Podemos Filtrar
    const cars = await Car
        .find({company: 'BMW'})
        .skip((pageNumber-1)*pageSize)
        .limit(pageSize)
        .count()
        console.log(cars)
}

getPaginationCars();

/*
update documents
*/
async function updateCar(id){
    const car = await Car.findById(id)
    //Si no encontramos el coche, volvemos
    if(!car)return
    //sino actulizamo el curso, con "."
    car.sold = false
    car.model = 'AUDI'
    //o lo pdemos hacer con set
    /*
    car.set({
        sold = false,
        model = 'Audi'
    })*/
    const result = await car.save()
    console.log(result)
}

updateCar()

//actualiamos sin hacer la query
//sino que utilizamos el metodo updateFist

async function updateFirstCar(id){
    const result = await Car.update({_id: id}, {
        $set:{
            model: 'A3',
            price: 2000
        }
    })
    console.log(result)
}

updateFirstCar()

//Borrar document


async function deleteCar(id){
    //puedes borrar por lo que quieras.
    const result = await Car.deleteOne({_id: id})
    console.log(result)
}

deleteCar()