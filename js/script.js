'use strict';

/* ******************************************************************************
 * VARIABLES GLOBALES (ES5)
 * ******************************************************************************/
var nivel = 0;
var score = 0;
var tiempoInicio = null;
var penalizacionTiempo = 0;
var intervaloTiempo = null; 
var nombreJugador = '';
var secuenciaJuego = [];      
var secuenciaJugador = [];    
var juegoActivo = false;
var colores = ['verde', 'rojo', 'amarillo', 'azul'];
// Referencias del DOM
var tituloPrincipal = document.getElementById('tituloPrincipal');
var tituloNivel = document.getElementById('tituloNivel');
var botones = document.querySelectorAll('.boton-simon');
// Referencias de Display
var displayNivel = document.getElementById('displayNivel');
var displayScore = document.getElementById('displayScore');
var displayTiempo = document.getElementById('displayTiempo');
var nombreJugadorDisplay = document.getElementById('nombreJugador');
// Referencias de Modales
var modalInicio = document.getElementById('modalInicio');
var modalGameOver = document.getElementById('modalGameOver');
var modalRanking = document.getElementById('modalRanking');
// Referencias de Botones y Inputs
var btnEmpezar = document.getElementById('btnEmpezar');
var btnReiniciar = document.getElementById('btnReiniciar');
var btnVerRankingGameOver = document.getElementById('btnVerRankingGameOver');
var btnVerRanking = document.getElementById('btnVerRanking');
var btnCerrarRanking = document.getElementById('btnCerrarRanking');
var btnCerrarInicio = document.getElementById('btnCerrarInicio');
var ordenarScore = document.getElementById('ordenarScore');
var ordenarFecha = document.getElementById('ordenarFecha');
var inputNombre = document.getElementById('inputNombre');
var errorNombre = document.getElementById('errorNombre');


/* ******************************************************************************
 * INICIALIZACIÓN DEL DOM Y EVENT LISTENERS
 * ******************************************************************************/

/**
 * Inicializa el juego al cargar la página.
 */
function inicializar() {
    // Oculto todos los modales menos el de inicio.
    gestionarModal(modalGameOver, false);
    gestionarModal(modalRanking, false);
    gestionarModal(modalInicio, true);

    tituloPrincipal.textContent = 'Simon Dice';
    tituloNivel.classList.add('oculto');
    
    // Event Listeners
    btnEmpezar.addEventListener('click', manejarClickEmpezar);
    btnReiniciar.addEventListener('click', manejarClickReiniciar);
    btnVerRankingGameOver.addEventListener('click', manejarClickVerRankingDesdeGameOver);
    btnVerRanking.addEventListener('click', manejarClickVerRanking);
    btnCerrarRanking.addEventListener('click', manejarClickCerrarRanking);
    btnCerrarInicio.addEventListener('click', manejarClickCerrarInicio);
    ordenarScore.addEventListener('click', manejarClickOrdenarScore);
    ordenarFecha.addEventListener('click', manejarClickOrdenarFecha);
}

// Ya que usamos defer en el script, podemos llamar a la función de inicialización directamente.
inicializar();


/* ******************************************************************************
 * LÓGICA DE JUEGO PRINCIPAL
 * ******************************************************************************/

/**
 * Función principal para iniciar el juego.
 */
function iniciarJuego() {
    if (juegoActivo === false) { 
        // Reinicio de variables
        nivel = 0;
        score = 0;
        secuenciaJuego = [];
        secuenciaJugador = [];
        juegoActivo = true;

        // Actualizar displays
        displayScore.textContent = score;
        displayNivel.textContent = nivel;
        displayTiempo.textContent = '0s';
        
        // Iniciar el contador de tiempo
        iniciarContadorTiempo();
        
        // Inicia el primer nivel
        setTimeout(siguienteNivel, 1000);
    }
}

/**
 * Prepara el estado para el siguiente nivel.
 */
function siguienteNivel() {
    nivel++;
    secuenciaJugador = []; 
    
    displayNivel.textContent = nivel;
    tituloPrincipal.textContent = 'Memoriza...';
    tituloNivel.classList.add('oculto');

    deshabilitarInteraccion();

    agregarColorASecuencia(); 
    
    setTimeout(function() {
        mostrarSecuencia();
    }, 500); 
}

/**
 * Muestra la secuencia actual del juego al jugador.
 */
function mostrarSecuencia() {
    var i = 0;
    var intervalo = setInterval(function() {
        var color = secuenciaJuego[i];
        iluminarBoton(color);

        i++;
        if (i >= secuenciaJuego.length) {
            clearInterval(intervalo);
            setTimeout(function() {
                // Retraso la habilitación para "espere" el fin de la última animación de iluminación del botón
                habilitarInteraccion();
            }, 400);
        }
    }, 600);
}

/**
 * Captura el clic del jugador, registra la respuesta y la verifica.
 */
function manejarClicBoton(evento) {
    var colorClickeado = '';
    
    if (juegoActivo === false) { 
        return; 
    } 
    
    colorClickeado = evento.target.id; 
    
    // 1. Efecto Visual Inmediato
    iluminarBoton(colorClickeado); 

    // 2. Registro la respuesta
    secuenciaJugador.push(colorClickeado);

    // 3. Verifico si el último clic es correcto (Retraso la verificación 
    // para que quede coherente con la animación del botón)
    setTimeout(function() {        
        verificarRespuesta();
    }, 350);
}

/**
 * Verifica si la secuencia del jugador coincide con la secuencia del juego.
 */
function verificarRespuesta() {
    var indiceActual = secuenciaJugador.length - 1;

    // 1. Comprobación de error
    if (secuenciaJugador[indiceActual] !== secuenciaJuego[indiceActual]) {
        terminarJuego('Perdiste la secuencia. ¡Vuelve a intentarlo!');
        return; 
    }
    
    // 2. Requerimiento Obligatorio: Agregar puntaje por cada luz de color presionada correctamente
    score++;
    displayScore.textContent = score;

    // 3. Comprobación de éxito (Si el jugador completó la secuencia)
    if (secuenciaJugador.length === secuenciaJuego.length) {
        deshabilitarInteraccion(); 
        tituloPrincipal.textContent = '¡Correcto!';
        tituloNivel.classList.remove('oculto');
        
        setTimeout(siguienteNivel, 1000);
    }
}

/**
 * Finaliza el juego, calcula el puntaje final y muestra el modal.
 * @param {string} mensaje - Mensaje de Game Over a mostrar.
 */
function terminarJuego(mensaje) {
    var tiempoTranscurrido = 0;
    var scoreFinal = 0;
    var nivelFinal = 0;
    
    tiempoTranscurrido = calcularTiempoTranscurrido();
    
    // Requerimiento deseado: Penalización por tiempo (1 punto por cada 10 segundos)
    penalizacionTiempo = Math.floor(tiempoTranscurrido / 10); 
    scoreFinal = score - penalizacionTiempo;
    
    // Asegurar que el puntaje no sea negativo
    if (scoreFinal < 0) { 
        scoreFinal = 0; 
    }
    
    // Nivel alcanzado es el nivel actual menos 1
    nivelFinal = nivel - 1; 

    // Guardar resultado
    guardarResultado(scoreFinal, nivelFinal, tiempoTranscurrido);
    
    // Desactivar el juego y la interacción
    deshabilitarInteraccion();
    juegoActivo = false;
    
    // Mostrar modal de Game Over
    document.getElementById('gameOverTitulo').textContent = '¡FIN DE PARTIDA!';
    document.getElementById('gameOverMensaje').textContent = mensaje;
    document.getElementById('finalScoreDisplay').textContent = scoreFinal;
    document.getElementById('finalNivelDisplay').textContent = nivelFinal;
    
    gestionarModal(modalGameOver, true);
}

/* ******************************************************************************
 * MANEJADORES DE EVENTOS DE MODALES
 * ******************************************************************************/

/**
 * Valida el nombre de jugador y, si es válido, inicia el juego.
 */
function manejarClickEmpezar() {
    var nombre = inputNombre.value;
    
    // Validación: mínimo 3 letras para el nombre (Requerimiento Obligatorio)
    if (nombre.length < 3) {
        errorNombre.textContent = 'El nombre debe tener al menos 3 caracteres.';
        return;
    }
    
    // Si es válido, guardar el nombre, actualizar el display e iniciar
    nombreJugador = nombre;
    nombreJugadorDisplay.textContent = nombre;
    errorNombre.textContent = '';
    gestionarModal(modalInicio, false);
    iniciarJuego();
}

/**
 * Reinicia la partida después de Game Over.
 */
function manejarClickReiniciar() {
    gestionarModal(modalGameOver, false);
    // Vuelve a mostrar el modal de inicio para validar el nombre
    gestionarModal(modalInicio, true); 
}

/**
 * Muestra el modal de ranking.
 */
function manejarClickVerRanking() {
    cargarRanking('puntaje'); // Cargar por defecto ordenado por puntaje
    gestionarModal(modalRanking, true);
}

/**
 * Cierra el modal de ranking.
 */
function manejarClickCerrarRanking() {
    gestionarModal(modalRanking, false);
}

/**
 * Cierra el modal de inicio.
 */
function manejarClickCerrarInicio() {
    gestionarModal(modalInicio, false);
}

/**
 * Muestra el ranking desde el modal de Game Over.
 */
function manejarClickVerRankingDesdeGameOver() {
    // Primero oculta el modal de Game Over
    gestionarModal(modalGameOver, false);
    // Luego, muestra el del ranking
    manejarClickVerRanking();
}

/* ******************************************************************************
 * RANKING (LOCAL STORAGE)
 * ******************************************************************************/

/**
 * Genera el cuerpo de la tabla del ranking con datos ordenados.
 * @param {string} criterio - 'puntaje' o 'fecha'.
 */
function cargarRanking(criterio) {
    var resultados = JSON.parse(localStorage.getItem('rankingSimonDice'));
    var tbody = document.getElementById('cuerpoTablaRanking');
    var i = 0;
    var filasHTML = '';
    
    if (resultados === null || resultados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No hay partidas guardadas.</td></tr>';
        return;
    }
    
    // Ordenar los resultados (Requerimiento Deseado)
    resultados.sort(function(a, b) {
        if (criterio === 'puntaje') {
            // Orden descendente por puntaje
            return b.puntaje - a.puntaje;
        } else if (criterio === 'fecha') {
            // Orden descendente por fecha (más reciente primero)
            return b.fecha - a.fecha;
        }
        return 0; // No hay cambio
    });
    
    // Limpio la tabla
    tbody.innerHTML = ''; 
    
    // Genero filas de HTML con los resultados
    for (i = 0; i < resultados.length; i++) {
        var resultado = resultados[i];
        var fechaObj = new Date(resultado.fecha);
        var fechaFormateada = fechaObj.toLocaleDateString() + ' ' + fechaObj.toLocaleTimeString();

        filasHTML += '<tr>';
        filasHTML += '<td>' + resultado.nombre + '</td>';
        filasHTML += '<td>' + resultado.puntaje + '</td>';
        filasHTML += '<td>' + resultado.nivel + '</td>';
        filasHTML += '<td>' + fechaFormateada + '</td>';
        filasHTML += '</tr>';
    }
    
    tbody.innerHTML = filasHTML;
}

/**
 * Manejador para ordenar el ranking por puntaje.
 */
function manejarClickOrdenarScore() {
    cargarRanking('puntaje');
}

/**
 * Manejador para ordenar el ranking por fecha.
 */
function manejarClickOrdenarFecha() {
    cargarRanking('fecha');
}

/* ******************************************************************************
 * FUNCIONES AUXILIARES Y DE TIEMPO
 * ******************************************************************************/

/**
 * Inicia el contador de tiempo.
 */
function iniciarContadorTiempo() {
    tiempoInicio = Date.now();
    
    intervaloTiempo = setInterval(function() {
        var tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
        displayTiempo.textContent = tiempoTranscurrido + 's';
    }, 1000);
}

/**
 * Calcula el tiempo transcurrido en segundos y detiene el contador.
 * @returns {number} Tiempo transcurrido en segundos.
 */
function calcularTiempoTranscurrido() {
    var tiempoFinal = Date.now();
    var segundosTranscurridos = Math.floor((tiempoFinal - tiempoInicio) / 1000);

    clearInterval(intervaloTiempo);
    displayTiempo.textContent = segundosTranscurridos + 's';
    
    return segundosTranscurridos;
}

/**
 * Guarda el resultado de la partida en LocalStorage.
 * @param {number} puntaje - Puntaje final de la partida.
 * @param {number} nivelFinal - Nivel alcanzado.
 * @param {number} tiempo - Tiempo total transcurrido.
 */
function guardarResultado(puntaje, nivelFinal, tiempo) {
    var resultados = JSON.parse(localStorage.getItem('rankingSimonDice'));
    var fecha = new Date();
    
    if (resultados === null) {
        resultados = [];
    }
    
    var registro = {
        nombre: nombreJugador,
        puntaje: puntaje,
        nivel: nivelFinal,
        tiempo: tiempo,
        fecha: fecha.getTime() // Guarda timestamp para ordenamiento
    };
    
    resultados.push(registro);
    
    // El ranking se limita por ordenamiento, no por tamaño estático.
    localStorage.setItem('rankingSimonDice', JSON.stringify(resultados));
}

/**
 * Muestra u oculta un modal.
 * @param {HTMLElement} modal - El elemento modal a manipular.
 * @param {boolean} mostrar - true para mostrar, false para ocultar.
 */
function gestionarModal(modal, mostrar) {
    if (mostrar === true) {
        modal.classList.add('visible');
    } else {
        modal.classList.remove('visible');
    }
}

/**
 * Función auxiliar para iluminar y apagar un botón.
 * @param {string} color - El nombre de la clase/ID de color (ej: 'verde').
 */
function iluminarBoton(color) {
    var botonElemento = document.getElementById(color); 
    
    botonElemento.classList.add('iluminado');     
    setTimeout(function() {
        botonElemento.classList.remove('iluminado');
    }, 300);
}

/**
 * Genera un nuevo color aleatorio y lo añade a la secuencia.
 */
function agregarColorASecuencia() {
    var colorAleatorio = colores[Math.floor(Math.random() * 4)]; 
    secuenciaJuego.push(colorAleatorio);
}

/**
 * Deshabilita los clics en los botones.
 */
function deshabilitarInteraccion() {
    var i = 0;
    for (i = 0; i < botones.length; i++) {
        botones[i].removeEventListener('click', manejarClicBoton);
        botones[i].classList.add('no-click');
    }
}

/**
 * Habilita los clics en los botones (Turno del Jugador).
 */
function habilitarInteraccion() {
    var i = 0;
    tituloPrincipal.textContent = '¡Tu Turno!';
    tituloNivel.textContent = 'Nivel ' + nivel;
    tituloNivel.classList.remove('oculto');
    
    for (i = 0; i < botones.length; i++) {
        botones[i].addEventListener('click', manejarClicBoton);
        botones[i].classList.remove('no-click');
    }
}
