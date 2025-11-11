# Simon Dice - Proyecto Académico

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Este es un proyecto desarrollado con fines académicos para la materia "Introducción a la Programación Web". Consiste en una implementación completa del clásico juego "Simón Dice" utilizando tecnologías web estándar: HTML, CSS y JavaScript (ES5).

---

## ✨ Características Principales

El proyecto no solo implementa la lógica básica del juego, sino que también incluye varias características adicionales para crear una experiencia completa y robusta.

### Jugabilidad
- **Secuencia Infinita**: El juego aumenta de nivel progresivamente, añadiendo un nuevo color a la secuencia en cada ronda.
- **Feedback Visual**: Los botones se iluminan para mostrar la secuencia de la máquina y también cuando el jugador interactúa con ellos.
- **Contador de Tiempo**: Un cronómetro en pantalla muestra el tiempo total de la partida.
- **Sistema de Puntuación**:
    - Se obtiene 1 punto por cada color presionado correctamente.
    - Se aplica una **penalización por tiempo**: 1 punto menos por cada 10 segundos de juego.
- **Interfaz Responsiva**: El diseño se adapta a diferentes tamaños de pantalla, desde escritorio hasta dispositivos móviles.

### Ranking y Persistencia de Datos
- **Ranking de Jugadores**: Las puntuaciones se guardan localmente en el navegador del usuario utilizando `localStorage`.
- **Ordenamiento Dinámico**: El ranking se puede ordenar por **mejor puntaje** o por **fecha** de la partida (de más reciente a más antigua).
- **Datos Guardados**: Cada entrada del ranking almacena el nombre del jugador, puntaje final, nivel alcanzado y la fecha.

### Formulario de Contacto
- **Validación en el Cliente**: El formulario de contacto valida que el nombre sea alfanumérico, el email tenga un formato válido y el mensaje cumpla con una longitud mínima.
- **Integración con Cliente de Correo**: Al enviar el formulario, se utiliza un `mailto:` para abrir la aplicación de correo predeterminada del usuario con los datos precargados.

---

## 🚀 Cómo Jugar

1.  **Abre el archivo `index.html`** en tu navegador web.
2.  Aparecerá un modal donde deberás **ingresar un nombre de jugador** (mínimo 3 caracteres).
3.  Haz clic en **"Empezar"**.
4.  Observa la secuencia de colores que la máquina ilumina.
5.  **Repite la secuencia** haciendo clic en los botones en el mismo orden.
6.  Si aciertas, pasarás al siguiente nivel, donde la secuencia será más larga.
7.  Si te equivocas, el juego terminará y podrás ver tu puntaje final.
8.  Puedes consultar los mejores puntajes en cualquier momento haciendo clic en **"Ver Ranking"**.

---

## 📂 Estructura del Proyecto

El repositorio está organizado de la siguiente manera:

```
simon-says/
├── css/
│   └── styles.css        # Estilos principales, layout, animaciones y diseño responsivo.
├── js/
│   ├── script.js         # Lógica principal del juego, manejo de estado y ranking.
│   └── contacto.js       # Lógica y validación del formulario de contacto.
├── index.html            # Estructura del juego y la interfaz principal.
└── contacto.html         # Página con el formulario de contacto.
```

---

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Para la estructura semántica del contenido.
- **CSS3**: Para el diseño, los estilos, las animaciones de los botones y la responsividad (utilizando Flexbox).
- **JavaScript (ES5)**: Para toda la lógica del juego, la manipulación del DOM, el manejo de eventos y la interacción con `localStorage`.

---

## 📝 Autor

*   **Diego Bianchi** - *Desarrollo del proyecto*

Este proyecto fue creado para la materia "Introducción de la Programación Web" de la Universidad Abierta Interamericana (UAI).
