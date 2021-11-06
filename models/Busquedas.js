//importamos el fileSystem
const fs = require('fs');
//importamos axios para las peticiones https
const axios = require ('axios').default
//dec;aramos la clase busqueda y en ella van a estar todos los metodos que necesitemos
class Busquedas{
    historial =[];
    dbPath = './db/database.json';

    constructor(){
       //TODO: leer DB si existe
        this.leerDb();
    }
    //realizamos el capitalizado de las palabras de llas ciudades => es mas estetico
    get historialCapitalizado(){
                //hacemos el .map y 
        return this.historial.map( lugar =>{
            //separamos la string en la separacion
            let palabras = lugar.split(' ')
            //le decimos que el primer caracter va a ser mayuscula y le concatenamos todo lo demas
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1))
            //unimos nuevamente la string y la retornamos
            return palabras.join(' ')

        })
    }
    // parametros para la api de lugares
    get paramsMapBox(){
        return{
                    'access_token': process.env.MAPBOX_KEY,
                    'limit': 5,
                    'language': 'es'    
        }
    }
    //parametros para la api del clima
    get  paramsClima(){
        return{
            appid: process.env.API_KEY_CLIMA,
            units: 'metric',
            lang: 'es'
            
        }
    }
    //esta funcion nos va a returnar el lugar con su longitud y lactitud
    async ciudad(lugar = ''){
        //intenta esto
        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
                params: this.paramsMapBox
                
            })
            const respuesta = await instance.get()
            //retprma id, nombre, longitud y latitud
            return respuesta.data.features.map(lugar =>({
               id: lugar.id,
               nombre: lugar.place_name_es,              
               long: lugar.center[0],
               lat: lugar.center[1]
            }))
            
        //retorna el errror
        } catch (error) {
            return [];          
        }
      
      
    }

    //nos retornara el clima de la localidad exacta
    async climaLugar(lat , lon){
        //intenta esto
        try {
            //instancia de cereacion de la peticion
           const instance = axios.create({
               baseURL: "https://api.openweathermap.org/data/2.5/weather",
               params: {...this.paramsClima, lat, lon}
            }) 
            //guardamos la respuesta
           const respuesta = await instance.get();
           //desestructuramos la respuesta y obtenemos el main y el wheater
            const {weather, main} =respuesta.data
            
            return{
                //sacamos la descripcion la temp min, max, actual
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp

            }
       

        } //si hay error retorna esto 
        catch (error) {
            console.error(error)
        }
    }

    //agregamos al historial las ultimas 5 busquedas
    agregatHistorial(lugar = " "){
        //le decimos que si existe ya que no haga nada
        if( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }
        //recortamos el arreglo de 0,5 posiciones
        this.historial = this.historial.splice(0,5);
        //en el caso de que sa nuevo , que lo agregue al inicio del array
        this.historial.unshift( lugar.toLocaleLowerCase() );
        // Grabar en DB
        this.guardarDB();
    }

    guardarDB(){
        //cargaUtil
        const payload ={
            historial: this.historial
        };
        //le decimos que el arreglo de historial, va a ser escrito en la ubicacion
        // y que lo va a convertir a json
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
        
    }

    leerDb(){
        //le decimos que si no existe la bd que no retorne nada
        if(!fs.existsSync(this.dbPath)) return ;
        // en la constante info leemos la bd 
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        //parseamos el json a string
        const data = JSON.parse(info);
        //le decimos al arreglo de historial que objetnga el data.historial
        this.historial = data.historial;


    }
}



module.exports = Busquedas;