//DECLARACION ARRAY RANKING
let playerRanking = [
  {"rank": "1-", "name": "Pau", "points": "120" },
  {"rank": "2-", "name": "Cristine", "points": "70"},
  {"rank": "3-", "name": "Xiao", "points": "63"}
];

//Declaracion de botones del menu HOME
let botonJugar = document.getElementById("jugar");
let botonRanking = document.getElementById("ranking");
let botonInici = document.getElementById("inici");
let botonInici2 = document.getElementById("inici2");
let botonInici3 = document.getElementById("inici3");
let botonInici4 = document.getElementById("inici4");
let botonControles = document.getElementById("controls");

//Evento para mostrar los controles
botonControles.addEventListener("click", function () {
  document.getElementById("menu").style.display = "none";
  document.getElementById("controles").style.display = "flex";
});

//Evento para mostrar el ranking
botonRanking.addEventListener("click", function () {
  document.getElementById("menu").style.display = "none";
  document.getElementById("rankingMenu").style.display = "flex";
  let tabla = document.createElement("table");
  tabla.style.width = "100%";

  for (let y = 0; y < playerRanking.length; y++) {
    let tablaRow = tabla.insertRow(y);
    let infoObjecte = Object.getOwnPropertyNames(playerRanking[y]);
    for (let h = 0; h < infoObjecte.length; h++) {
      let columna = tablaRow.insertCell(h);
      columna.innerHTML = Object.values(playerRanking[y])[h];
      columna.style.color = "white";
      columna.style.fontSize = "50px";
    }
  }
  document.getElementById("rankingList").appendChild(tabla);

  //Evento para volver al menú de inicio desde el ranking menu
botonInici.addEventListener("click", function () {
  document.getElementById("rankingMenu").style.display = "none";
  document.getElementById("menu").style.display = "flex";
  document.getElementById("rankingList").removeChild(tabla);
});
});

//Evento para volver al menú de inicio desde el menu de controles
botonInici2.addEventListener("click", function () {
  document.getElementById("controles").style.display = "none";
  document.getElementById("menu").style.display = "flex";
});

//Evento para volver al menú de inicio desde la pantalla de "has guanyat!"
botonInici3.addEventListener("click", function () {
  document.getElementById("hasGuanyat").style.display = "none";
  document.getElementById("menu").style.display = "flex";
  window.location.reload();
});

//Evento para volver al menú de inicio desde la pantalla de "Game Over"
botonInici4.addEventListener("click", function () {
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("menu").style.display = "flex";
  window.location.reload();
});

//Evento para mostrar el juego
botonJugar.addEventListener("click", function () {
  document.getElementById("menu").style.display = "none";
  document.getElementById("juego").style.display = "flex";

  //Declaración de variables.
  const grid = document.querySelector(".grid");
  let posicionNave = 202;
  let width = 15;
  let direccion = 1;
  let irDerecha = true;
  let displayResultado = document.querySelector(".resultados");
  let resultat = 0;
  var numDada = 1;

  let paused = false;

  let alienId;
  let aliensBorrats = [];
  let laserId;
  let posicionEspeciales = [];

  
  const aliens = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39,
  ];

  //Generamos el grid de cuadrados
  for (let i = 0; i < 225; i++) {
    const quadrados = document.createElement("div");
    grid.appendChild(quadrados);
  }
  const quadrados = Array.from(document.querySelectorAll(".grid div"));

  //Añadimos la nave en su posición inicial.
  quadrados[posicionNave].classList.add("nave");

  //Los event listener que hacen que al pulsar las teclas podamos mover la nave o disparar
  document.addEventListener("keydown", moverNave);
  document.addEventListener("keydown", disparar);
  document.addEventListener("keydown", function (e) {
    //Es el event listener que activa la funcio de pausar o la de reanudar el joc.
    if (e.key == "Escape") {
      if (paused) {
        reanudarJuego();
      } else {
        pausarJuego();
      }
    }
  });

  //dibujamos todos los aliens (tanto especiales como normales) por primera vez (antes de dibujar los especiales generamos su posicion).
  alienId = setInterval(moverAliens, 750);
  generarPosicionEspeciales();
  dibujarAliens();
  let disparoAlien = setInterval(dispararAliens, 1500);
  let disparoAlien2 = setInterval(dispararAliens, 2000);

  //generarPosicionEspeciales --> para guardar la posicion del array en la que estarán los aliens especiales (generado de manera aleatoria)
  function generarPosicionEspeciales() {
    let i = 0;
    while (i < 3) {
      //de momento genera 3, despues generarà dependiendo del grado seleccionado.
      let random1 = Math.floor(Math.random() * aliens.length);
      if (!posicionEspeciales.includes(random1)) {
        posicionEspeciales.push(random1);
        i++;
      }
    }
  }

  //dibujar todos los aliens (llamamos a dibujar los especiales tambien).
  function dibujarAliens() {
    for (let i = 0; i < aliens.length; i++) {
      if (!aliensBorrats.includes(i)) {
        quadrados[aliens[i]].classList.add("alien");
      }
    }
    for (let i = 0; i < posicionEspeciales.length; i++) {
      if (!aliensBorrats.includes(posicionEspeciales[i])) {
        dibujarEspeciales(i); //li passo el valor de "i" perque aixi sap quina es la posició que ha de borrar.
      }
    }
  }

  //FUNCION PARA DIBUJAR DE LOS ALIENS ESPECIALES GENERADOS ANTERIORMENTE DE MANERA ALEATORIA
  function dibujarEspeciales(i) {
    quadrados[aliens[posicionEspeciales[i]]].classList.add("alienEspecial");
  }

  //FUNCION PARA BORRAR TODOS LOS ALIENS
  function borrarAliens() {
    for (let i = 0; i < aliens.length; i++) {
      quadrados[aliens[i]].classList.remove("alien", "alienEspecial");
    }
  }

//FUNCIÓN PARA MODIFICAR LA POSICIÓN DE LA NAVE (MOVERLA) EN CUANTO EL JUGADOR CLIQUE LAS TECLAS.
  function moverNave(e) {
    if (paused == false) {
      quadrados[posicionNave].classList.remove("nave");

      switch (e.key) {
        case "ArrowLeft":
          if (posicionNave % width !== 0) {
            posicionNave = posicionNave - 1;
          }
          break;

        case "ArrowRight":
          if (posicionNave % width < width - 1) {
            posicionNave = posicionNave + 1;
          }
          break;
      }
      quadrados[posicionNave].classList.add("nave");
    }
  }

  //FUNCIÓN PARA MOVER LOS ALIENS (LLAMADA CON UN INTERVAL)
  function moverAliens() {
    const bordeIzquierdo = aliens[0] % width === 0;
    const bordeDerecho = aliens[aliens.length - 1] % width === width - 1;
    borrarAliens();

    if (bordeDerecho && irDerecha) {
      for (let i = 0; i < aliens.length; i++) {
        aliens[i] = aliens[i] + width + 1;
        direccion = -1;
        irDerecha = false;
      }
    }

    if (bordeIzquierdo && !irDerecha) {
      for (let i = 0; i < aliens.length; i++) {
        aliens[i] = aliens[i] + width - 1;
        direccion = 1;
        irDerecha = true;
      }
    }

    for (let i = 0; i < aliens.length; i++) {
      aliens[i] = aliens[i] + direccion;
    }

    dibujarAliens();

   //CONDICIÓN PARA TERMINAR EL JUEGO EN CASO DE HABER PERDIDO
    if (quadrados[posicionNave].classList.contains("alien", "nave")) {
      resultat = resultat - 15;
      clearInterval(alienId);
      paused = true;
      document.getElementById("juego").style.display = "none";
      document.getElementById("gameOver").style.display = "flex";
      document.getElementById("puntuacioPerdut").innerHTML = "PUNTUACIÓ: "+resultat;
    }

    for (let i = 0; i < aliens.length; i++) {
      if (aliens[i] > quadrados.length) {
        displayResultado.innerHTML = "GAME OVER";
        clearInterval(alienId);
      }
    }

    //CONDICIÓN PARA TERMINAR EL JUEGO EN CASO DE HABER GANADO.
    if (aliensBorrats.length === aliens.length) {
      paused = true;
      clearInterval(alienId);
      document.getElementById("juego").style.display = "none";
      document.getElementById("hasGuanyat").style.display = "flex";
      document.getElementById("puntuacioGuanyat").innerHTML = "PUNTUACIÓ: "+resultat;
    }
  }


// FUNCION PARA DISPARAR 
  function dispararAliens() {
    if (paused == false) {
      let posicioExisteix = false;
      let posicionLaserAlien;
      let random2;
      while(posicioExisteix == false && aliensBorrats.length !== aliens.length){ //BUCLE HECHO PARA QUE BUSQUE UNA POSICIÓN DE UN ALIEN QUE NO ESTÉ DESTRUIDO PARA DISPARAR.
        random2 = Math.floor(Math.random() * aliens.length);
        if(quadrados[aliens[random2]].classList.contains("alien")){
          posicionLaserAlien = aliens[random2];
          posicioExisteix = true;
        }else{
          posicioExisteix = false;
        }
      }
      //FUNCION QUE ESTA DENTRO DE LA DE dispararAlien PARA MOVER EL LASER UNA VEZ SE GENERA LA POSICIÓN DESDE DONDE SE DISPARA
      function moverLaserAlien() {
        if (quadrados[posicionLaserAlien]) {
          quadrados[posicionLaserAlien].classList.remove("laserAlien");

          posicionLaserAlien = posicionLaserAlien + width;

          if (quadrados[posicionLaserAlien])
            quadrados[posicionLaserAlien].classList.add("laserAlien");

          if (!quadrados[posicionLaserAlien + width]) {
            if (quadrados[posicionLaserAlien]) quadrados[posicionLaserAlien].classList.remove("laserAlien");
          }

          if (quadrados[posicionLaserAlien] && quadrados[posicionLaserAlien].classList.contains("nave")) {
            clearInterval(alienId);
            paused = true;
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "T'han donat a la nau! -15 punts!",
              showConfirmButton: false,
              timer: 1000,
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
                reanudarJuego();
              }
            });
            resultat = resultat - 15;
            displayResultado.innerHTML = resultat;
          }
        }
      }
      let idLaserAlien = setInterval(moverLaserAlien, 100);
    }
  }


//FUNCIÓN DE LA NAVE PARA DISPARAR CUANDO APRETEMOS EL "ESPACIO"
  function disparar(e) {
    if (paused == false) {
      let posicionLaser = posicionNave;

      function moverLaser() {
        quadrados[posicionLaser].classList.remove("laser");
        posicionLaser = posicionLaser - width;
        quadrados[posicionLaser].classList.add("laser");

        if (quadrados[posicionLaser - width] == undefined) {
          quadrados[posicionLaser].classList.remove("laser");
          clearInterval(laserId);
          laserId = undefined;
        }

        if (quadrados[posicionLaser].classList.contains("alien")) {
          quadrados[posicionLaser].classList.remove("laser");
          quadrados[posicionLaser].classList.remove("alien");
          if (quadrados[posicionLaser].classList.contains("alienEspecial")) {
            clearInterval(alienId);
            paused = true;
            quadrados[posicionLaser].classList.remove("alienEspecial");
            Swal.fire({
              icon: "info",
              title: "Sortida laboral " + numDada,
              text: "Text de la base de dades de la sortida laboral",
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((result) => {
              if (result.isConfirmed) {
                reanudarJuego();
              }
            });

            numDada++;
            resultat = resultat + 5;
          }
          quadrados[posicionLaser].classList.add("boom");

          setTimeout(
            () => quadrados[posicionLaser].classList.remove("boom"),
            300
          );
          clearInterval(laserId);
          laserId = undefined;

          const alienBorrat = aliens.indexOf(posicionLaser);
          aliensBorrats.push(alienBorrat);
          resultat = resultat + 5;
          displayResultado.innerHTML = resultat;
        }
      }

      switch (e.key) {
        case " ":
          if (!laserId) laserId = setInterval(moverLaser, 50);
      }
    }
  }

  function reanudarJuego() {
    alienId = setInterval(moverAliens, 750);
    paused = false;
  }

  function pausarJuego() {
    clearInterval(alienId);
    paused = true;
    menuPause();
  }

  function menuPause() {
    Swal.fire({
      customClass: {
        title: "title-custom",
      },
      title: "Joc Pausat",
      width: 600,
      padding: "3em",
      background: "#fff url(./img/pauseBackground.jpg) 200px",
      confirmButtonText: "Reprendre",
      allowEscapeKey: false,
      allowOutsideClick: false,
      backdrop: `
              rgba(0,0,123,0.4)
              url("./img/pauseIcon.png")
              left top
              no-repeat`,
    }).then((result) => {
      if (result.isConfirmed) {
        reanudarJuego();
      }
    });
  }
});
