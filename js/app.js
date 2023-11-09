const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', ()=> {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    /* Validacion para API 
        muchas apis requieren informacion como ellas lo esperan
    */
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        mostrarError('Todos los campos son requeridos');
        return;
    }
    // Consultar API
    consultarAPI(ciudad,pais)
        .then( data => {
            // console.log(data);
            limpiarHTML();

            if (data.cod === '404') {
                mostrarError('Ciudad no encontrada');
                return;
            }

            // imprimir respuesta en HTML
            mostrarClima(data);
        });
}

function mostrarClima(data) {
    // destructuring de propiedades que se encuentran dentro del objeto (main) que esta en el objeto data
    const {main: {temp, temp_max, temp_min}, name} = data;
    const centigrados = kelvinACentrigrados(temp);
    const max = kelvinACentrigrados(temp_max);
    const min = kelvinACentrigrados(temp_min);


    const nombreCity = document.createElement('p');
    nombreCity.innerHTML = name;
    nombreCity.className = 'font-bold text-6xl';

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.className = 'font-bold text-6xl';

    const tempMax= document.createElement('p');
    tempMax.innerHTML = `Max: ${max} &#8451;`;
    tempMax.className = 'text-xl';
    
    const tempMin= document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451;`;
    tempMin.className = 'text-xl';

    const resultadoDiv = document.createElement('div');
    resultadoDiv.className = 'text-center text-white';
    resultadoDiv.appendChild(nombreCity);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);

    resultado.appendChild(resultadoDiv);
}

// funciones Helpers, que solo hacen una funcion y conviene hacerlas con arrow function para mejor sintaxis
const kelvinACentrigrados = grados => parseInt(grados -273.15);


function consultarAPI(ciudad,pais) {
    // mostrar un spinner mientras se realiza la consulta, este se eliminara al limpiar el html en .then
    spinner();

    // id que proporciona la API en su sitio web: https://openweathermap.org/
    const appId = '82acca4ee81dc4fcd402d50c9dcd3ef3';

    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`)
        .then( respuesta => respuesta.json())        
};

function mostrarError(mensaje) {
    const alerta = document.querySelector('.alerta');

    if (!alerta) {
        // crear alerta
        const alerta = document.createElement('div');
        alerta.className = 'bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto mt-6 text-center alerta';
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;
    
        container.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {
    limpiarHTML();
    // spinner de spinkit
    const divSpinner = document.createElement('div');
    divSpinner.className = 'spinner';

    divSpinner.innerHTML= `
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    `;

    resultado.appendChild(divSpinner);
}