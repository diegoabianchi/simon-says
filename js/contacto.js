'use strict';

/* ******************************************************************************
 * VARIABLES GLOBALES
 * ******************************************************************************/

var formularioContacto = document.getElementById('formularioContacto');
var nombreInput = document.getElementById('nombre');
var emailInput = document.getElementById('email');
var mensajeInput = document.getElementById('mensaje');

var errorNombreC = document.getElementById('errorNombreC');
var errorEmailC = document.getElementById('errorEmailC');
var errorMensajeC = document.getElementById('errorMensajeC');
var mensajeExito = document.getElementById('mensajeExito');


/* ******************************************************************************
 * FUNCIONES AUXILIARES DE VALIDACIÓN
 * ******************************************************************************/

/**
 * Valida un correo electrónico.
 * @param {string} email - El string del correo a validar.
 * @returns {boolean} true si es válido, false si no.
 */
function validarEmail(email) {
    // Expresión regular ES5 para validar formato básico de email
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return re.test(email);
}

/**
 * Valida si un string es alfanumérico (letras y números).
 * @param {string} str - El string a validar.
 * @returns {boolean} true si es válido, false si no.
 */
function validarAlfanumerico(str) {
    // Expresión regular para validar letras, números y espacios.
    var re = /^[a-zA-Z0-9\s]+$/;
    return re.test(str);
}


/* ******************************************************************************
 * MANEJADOR DEL FORMULARIO
 * ******************************************************************************/

/**
 * Maneja el envío del formulario, valida los campos y abre mailto.
 * @param {Event} evento - El objeto Evento.
 */
function manejarEnvioFormulario(evento) {
    var nombre = nombreInput.value;
    var email = emailInput.value;
    var mensaje = mensajeInput.value;
    var esValido = true;
    var mailtoLink = '';

    evento.preventDefault();

    // Limpiar mensajes de error previos
    errorNombreC.textContent = '';
    errorEmailC.textContent = '';
    errorMensajeC.textContent = '';
    mensajeExito.textContent = '';

    // 1. Validar Nombre (Alfanumérico - Requerimiento Obligatorio)
    if (nombre.length === 0 || validarAlfanumerico(nombre) === false) {
        errorNombreC.textContent = 'El nombre no puede estar vacío y debe ser alfanumérico.';
        esValido = false;
    }

    // 2. Validar Email (Válido - Requerimiento Obligatorio)
    if (validarEmail(email) === false) {
        errorEmailC.textContent = 'Ingrese un correo electrónico válido.';
        esValido = false;
    }

    // 3. Validar Mensaje (más de 5 caracteres - Requerimiento Obligatorio)
    if (mensaje.length < 5) {
        errorMensajeC.textContent = 'El mensaje debe tener más de 5 caracteres.';
        esValido = false;
    }

    // Si todas las validaciones son exitosas
    if (esValido === true) {
        // Construir el link mailto (Requerimiento Obligatorio)
        mailtoLink = 'mailto:correo.destinatario@ejemplo.com' +
                     '?subject=' + encodeURIComponent('Mensaje de Contacto - Simon Dice') +
                     '&body=' + encodeURIComponent('De: ' + nombre + '\n' +
                                                'Email: ' + email + '\n\n' +
                                                'Mensaje: ' + mensaje);
        
        // Abrir la herramienta de envío predeterminada
        window.location.href = mailtoLink;
        
        // Mensaje de éxito (el formulario se reinicia después del mailto)
        mensajeExito.textContent = 'Validación exitosa. Se abrirá tu aplicación de correo.';
        formularioContacto.reset();
    }
}


/* ******************************************************************************
 * INICIALIZACIÓN
 * ******************************************************************************/

/**
 * Inicializa los Event Listeners del formulario.
 */
function inicializarContacto() {
    // Asignar el manejador de envío al formulario
    formularioContacto.addEventListener('submit', manejarEnvioFormulario);
}

window.onload = inicializarContacto;