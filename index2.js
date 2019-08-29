const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cars', {useNewUrlParser: true})
    .then(()=>console.log('Conectado a Mongo'))
    .catch(err => console.log('No se ha conectado'))
//Validation
//Con esto decimos que campos son necesarios 
const carSchema = new mongoose.Schema({
    company: {
        type: String, 
        required: true,
        minlength: 2,
        maxlength: 230,
        //enum para dar los valores que puede tomar
        enum: ['BMW', 'AUDI']
    },
    model: String,
    //decimos prices es requido si no ha sido vendido
    price: {type: Number, required: function(){return this.sold}},
    year: {
        type: Number,
        min: 1990,
        max: 2030
    },
    sold: Boolean,
    extras: [String], //Array de Strings
    //creamos con fecha de creacion
    date: {type: Date, default: Date.now},
})


const Car = mongoose.model('Car', carSchema)
async function createCar(){
    //sino ponemos company que es un parametro
    //que tiene que tener nos dara error. 
    const car = new Car({
        company: 'BMW',
        model: 'X7',
        price: 6000,
        year: 2024, 
        sold: true,
        extras: ['4*4', 'Automatic'],
        //no hace falta poner la fecha
    })
    try{
        const result = await car.save();
        console.log(result)
    }catch(e){
        console.log(e.message)
    }
}
createCar()




