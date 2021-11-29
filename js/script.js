//Declaración de variables.
    const grid = document.querySelector(".grid");
    let posicionNave = 202;
    let width = 15;
    let direccion = 1;
    let irDerecha = true;
    let displayResultado = document.querySelector(".resultados");
    let resultat = 0;
    
    let paused = false;
    
    let alienId;
    let aliensBorrats = [];
    let laserId;
    let posicionEspeciales = [];
    
    
    alienId = setInterval(moverAliens, 1000);
    
    const aliens = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
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
    document.addEventListener('keydown', moverNave);
    document.addEventListener("keydown", disparar);
    document.addEventListener("keydown", function(e){//Es el event listener que activa la funcio de pausar o la de reanudar el joc.
        if(e.key == 'Escape'){
            if(paused){
                reanudarJuego();
            }else{
                pausarJuego();
            }
        }
    });
    
    //dibujamos todos los aliens (tanto especiales como normales) por primera vez (antes de dibujar los especiales generamos su posicion).
    generarPosicionEspeciales();
    dibujarAliens();
    //dibujarEspeciales();
    
    //generarPosicionEspeciales --> para guardar la posicion del array en la que estarán los aliens especiales.
    function generarPosicionEspeciales() {
        let i=0;
        while(i<3) { //de momento genera 3, despues generarà dependiendo del grado seleccionado.
            let random1 = Math.floor(Math.random() * aliens.length);
            if(!posicionEspeciales.includes(random1)){
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
        for(let i=0; i<posicionEspeciales.length; i++){
            if(!aliensBorrats.includes(posicionEspeciales[i])){
                dibujarEspeciales(i); //li passo el valor de "i" perque aixi sap quina es la posició que ha de borrar.
            }
        }
        
    }
    
    //dibujar los aliens especiales
    function dibujarEspeciales(i){
            quadrados[aliens[posicionEspeciales[i]]].classList.add("alienEspecial");   
    }
    
    
    function borrarAliens() {
        for (let i = 0; i < aliens.length; i++) {
            quadrados[aliens[i]].classList.remove("alien", "alienEspecial");
        }
    }
    
    function moverNave(e) {
        if(paused == false){
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
    
        if (quadrados[posicionNave].classList.contains("alien", "nave")) {
            displayResultado.innerHTML = "GAME OVER";
            clearInterval(alienId);
        }
    
        for (let i = 0; i < aliens.length; i++) {
            if (aliens[i] > quadrados.length) {
                displayResultado.innerHTML = "GAME OVER";
                clearInterval(alienId);
            }
        }
        if (aliensBorrats.length === aliens.length) {
            displayResultado.innerHTML = "HAS GUANYAT!";
            clearInterval(alienId);
        }
    }
    
    function disparar(e) {
        if(paused == false){
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
                if(quadrados[posicionLaser].classList.contains("alienEspecial")){
                    quadrados[posicionLaser].classList.remove("alienEspecial");
                }
                quadrados[posicionLaser].classList.add("boom");
    
                setTimeout(() => quadrados[posicionLaser].classList.remove("boom"), 300);
                clearInterval(laserId);
                laserId = undefined;
    
                const alienBorrat = aliens.indexOf(posicionLaser);
                aliensBorrats.push(alienBorrat);
                resultat++;
                displayResultado.innerHTML = resultat;
            }
        }
    
        switch (e.key) {
            case " ":
                if (!laserId) laserId = setInterval(moverLaser, 50);
        }
        }
    }
    
    function reanudarJuego(){
        alienId = setInterval(moverAliens, 1000);
        paused = false;
    }
    
    function pausarJuego(){
        clearInterval(alienId);
        paused = true;
        menuPause();
    }

    function menuPause(){
        Swal.fire({
            customClass:{
                title: 'title-custom',
            },
            title: 'Joc Pausat',
            width: 600,
            padding: '3em',
            background: '#fff url(./img/pauseBackground.jpg) 200px',
            confirmButtonText: 'Reprendre',
            backdrop: `
              rgba(0,0,123,0.4)
              url("./img/pauseIcon.png")
              left top
              no-repeat`
          }).then((result) => {
            if (result.isConfirmed) {
                reanudarJuego();
            }
          })
    }
