//en este archivo estan todas las respuestas 
//de lo que necesitamos
const inquirer = require('inquirer');
require('colors')

const preguntas = [
    //estan las diferentes opciones del usuario
    {  
    type: 'list',
    name: 'opcion',
    message: 'que desea hacer?',
    choices: [
        {
            value: 1,
            name: '1.'.green+'Buscar ciudad'
        },
        { 
            value: 2,
            name: '2.'.green+'Historial'
        },
        { 
            value: 0,
            name: '0.'.green+'Salir'
        } 
            ]
    }
]
//el inquire menu muestra la cabecera del menu y muestra las preguntas,
//este retorna la opcion elegida por el usuario
const inquiererMenu = async ()=>{
       
    console.clear();
    console.log('= = = = = = = = = = = = ='.green);
    console.log('= '.green+'Seleccione una opcion'.white+' ='.green);
    console.log('= = = = = = = = = = = = = \n'.green);    
    //desestructuramos la opcion de preguntas
    const {opcion} = await inquirer.prompt(preguntas)
    
    return opcion;

  
}
//con esta funcion le decimos qu espere hasta que se presione el enter
const pausa = async() =>{        
    const question = 
    //opcion de enter para continuar
    {
        type: 'input',
        name: 'enter',
        message: `presione ${'enter'.green} para continuar `
    }
    console.log('\n')
    //lee el enter y retorna para que siga el programa
   return await inquirer.prompt(question)

}
//esta funcion lee la tarea ingresada en el programa principal
    const leerInput = async(message) =>{
    //definimos el input
        const question=[
            {
            //tipo input para que la persona pueda escribir
            type:'input',
            //nombre de la propiedad
            name:'desc',
            //el mensaje es opcional
            message,
            //el validate permite hacer validaciones con el valor ingresado
            validate(value){
                    if(value.length === 0){
                        return 'Por favor ingrese un valor';
                    }
                    //retorna true si la validacion paso
                    return true;
            }
        }
    ]
    //realizamos la desestructuracion desde inquirer.promp
    const {desc} = await inquirer.prompt(question);
    //returna la descripcion ingresada por el usuario
    return desc;
    }
    //funcion que lista la seleccion de tareas para eliminar una
    //pide las funciones como parametro
    const listarLugares = async (lugares = []) =>{
        //itera las tareas y nos devuevlve la tarea y su indice
        const choices = lugares.map((lugar, i) =>{
            //obtenemos el indice y le sumamos 1
            const idx = `${i+1}`.green
            //el .map retorna el id de la tarea como valor
            //t en el name el indice y la descritcion
            return {
                value: lugar.id,
                name: `${idx} ${lugar.nombre}`
            }
            
});
        //con esto agregamos a las choices que aparezca en el menu en esta funcion el 0
        choices.unshift({
            value: '0',
            name: '0'.green +' Cancelar'
        })
        // usamos el prompt para mostrar un mensaje que dica borrar
        const preguntas = [{
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar: ',
            choices
        }];

        const {id} = await inquirer.prompt(preguntas)

        return id;
}
//confirmamos la opcion del usuario
const confirmar = async(message)=>{
    //usamos el question del inquirer
    const question =[
    {
        type: 'confirm',
        name: 'ok',
        message
    }
];
const {ok} = await inquirer.prompt(question);
    //retprnamos el ok true o false
return ok;
}



module.exports = {
    inquiererMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
   
}