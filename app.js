require('dotenv').config();

const { leerInput, inquiererMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/Busquedas");




const main = async()=>{
    
    const busquedas = new Busquedas();
    let opt;
    do{ 
    //opcion va a esperar a que el usuario ingrese una opcion
   opt = await inquiererMenu();
    
    switch(opt){
   
        case 1: 
        //Mostrar mensaje
        const termino = await leerInput('Ciudad: ');
        //Buscar los lugares
                            //esperamos el metodo buscar ciudad
        const lugares = await busquedas.ciudad(termino)
       
        //seleccionar el lugar
                            // nos lista los lugares encontrados
        const idSeleccionado = await listarLugares(lugares);
        //em el caso que el usuario ingrese 0 saltea este paso y continua el bucle
        if(idSeleccionado === '0')continue;
        //guardar en db
        //busca el lugar seleccionado que tenga el mismo id
        const lugarSelecionado = lugares.find(lugar => lugar.id === idSeleccionado)
        //agregamos al historial de busqueda el nombre del lugar
        busquedas.agregatHistorial(lugarSelecionado.nombre);
        //clima
        //le mandamos a climaLugar la latitud y longitud
        const clima = await busquedas.climaLugar(lugarSelecionado.lat, lugarSelecionado.long);
        //mostrar resultados
        console.log('\ninformacion de la ciudad\n')
        console.log(`Nombre de la ciudad: `.green+`${lugarSelecionado.nombre}`.white)
        console.log(`Cielo actual: `.green+` ${clima.desc}`.white)
        console.log(`Actual: `.yellow + `${clima.temp}`.white)
        console.log(`Maxima: `.red +`${clima.max}`.white)
        console.log(`Minima: `.blue +`${clima.min}`.white)
        console.log(`Lat: `.green`${lugarSelecionado.lat}`.white)
        console.log(`Long: `.green+` ${lugarSelecionado.long}`.white)
        
        break;
        case 2: 
        //hacemos un foEach para recorrer el arreglo capitalizado
        busquedas.historialCapitalizado.forEach( (lugar, i) =>  {
            //extraemos el indice
            const idx = `${ i + 1 }.`.green;
            //imprimimos indice y el lugar 
            console.log( `${ idx }`+` ${ lugar } `.white );
        })
        break;

    }


    //si se ingresa cero no esperamos a la pausa
    if(opt !== 0){
         await pausa()}
        
}while(opt !== 0)


}

main();