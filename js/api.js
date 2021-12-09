/**
   * Send the score to api.
   * @param {Number} points The total points of player.
   */
 function send_score(points) {
    //If the player win the game or lose the game.
      let data = new FormData();
      data.append("action", "insert");
      data.append("id_game", 2);
      data.append("id_user", 1);
      data.append("id_cycle", 18);
      data.append("points", points);

      fetch("./backend/index.php", {
        method: "POST",
        cache: "no-cache",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.error(error));
  }

  /**
   * Get ranking from api.
   * @param {Element} table The table to insert records.
   */
   function get_ranking(tabla) {
      let data = new FormData();
      data.append("action", "get");
      data.append("top", 3);
      data.append("id_game", 2);
      data.append("id_user", 1);
      data.append("id_cycle", 18);

      fetch("./backend/index.php", {
        method: "POST",
        cache: "no-cache",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          for (let y = 0; y < data.data.length; y++) {
            let tablaRow = tabla.insertRow(y);
            let infoObjecte = Object.getOwnPropertyNames(data.data[y]);
            for (let h = 0; h < infoObjecte.length; h++) {
              let columna = tablaRow.insertCell(h);

              if (h === 0)  {
                columna.innerHTML = y + 1;
              } else {
                columna.innerHTML = Object.values(data.data[y])[h];
              }
              columna.style.color = "white";
              columna.style.fontSize = "50px";
            }
          }

          if (data.data_user !== null) {
            let tablaRow = tabla.insertRow(data.data.length);
            let infoObjecte = Object.getOwnPropertyNames(data.data_user);
            for (let h = 0; h < infoObjecte.length; h++) {
              let columna = tablaRow.insertCell(h);

              if (h === 0)  {
                columna.innerHTML = "-";
              } else {
                columna.innerHTML = Object.values(data.data_user)[h];
              }
              columna.style.color = "white";
              columna.style.fontSize = "50px";
            }
          }

          document.getElementById("rankingList").appendChild(tabla);

          let botonInici = document.getElementById("inici");

          //Evento para volver al menú de inicio desde el ranking menu
          botonInici.addEventListener("click", function () {
            document.getElementById("rankingMenu").style.display = "none";
            document.getElementById("menu").style.display = "flex";
          });
        })
        .catch((error) => console.error(error));
  }

   /**
   * Get all jobs oportunities from 
   * @param {Element} table The table to insert records.
   */
    function get_jobs(callback) {
      //If the player win the game or lose the game.
        let data = new FormData();
        data.append("action", "get_jobs_oportunities");
        data.append("id_cycle", 18);
  
        fetch("./backend/index.php", {
          method: "POST",
          cache: "no-cache",
          body: data,
        })
          .then((response) => response.json())
          .then((data) => {
            callback(data);
          })
          .catch((error) => console.error(error));
    }