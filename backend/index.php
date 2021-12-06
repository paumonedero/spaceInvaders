<?php

header('Content-Type: application/json; charset=utf-8');

//Import the librarys.
require_once("response.php");
require_once("constants.php");
require_once("database.php");

//If the action is defined and is not empty.
if (isset($_POST["action"]) && !empty($_POST["action"])) {
    //Get the action name.
    $action = $_POST["action"];

    //Check if the action exists.
    if (function_exists($action)) {
        //Call the action.
        $action();
    } else {
        Response::send(array("msg" => "Function not exists."), Response::HTTP_METHOD_NOT_ALLOWED);
    }
} else {
    Response::send(array("msg" => "Param 'action' missing."), Response::HTTP_METHOD_NOT_ALLOWED);
}

function get_jobs_oportunities() {
    $jobs = [];

    $id_cycle = isset($_POST["id_cycle"]) ? $_POST["id_cycle"] : -1;

    try {
        if ($id_cycle !== -1) {
            $db = new Database();

            $statement = $db->connect()->prepare("SELECT c.name as cicle, jo.name as job, jo.description
                                                  FROM cycle_jobs cj 
                                                  INNER JOIN cycle c ON c.id = cj.id_cycle
                                                  INNER JOIN job_oportunities jo ON jo.id = cj.id_job
                                                  WHERE cj.id_cycle = :id_cycle");

            $statement->bindParam(":id_cycle", $id_cycle);

            $statement->execute();

            $jobs = $statement->fetchAll(PDO::FETCH_ASSOC);

            Response::send(array("msg" => "Ok.", "data" => $jobs), Response::HTTP_OK);
        } else {
            Response::send(array("msg" => "Miss params."), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    } catch (PDOException $e) {
        Response::send(array("msg" => "An unexpected error has occurred: " . $e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

function get()
{
    $ranking = [];
    $ranking_user = null;

    $top = isset($_POST["top"]) ? $_POST["top"] : 3;
    $id_game = isset($_POST["id_game"]) ? $_POST["id_game"] : -1;
    $id_user = isset($_POST["id_user"]) ? $_POST["id_user"] : -1;
    $id_cycle = isset($_POST["id_cycle"]) ? $_POST["id_cycle"] : -1;

    try {
        if ($id_game !== -1 && $id_user !== -1 && $id_cycle !== -1) {
            $db = new Database();

            $statement = $db->connect()->prepare("SELECT u.id, u.nickname, ugc.points
                                                  FROM user_game_cycle ugc
                                                  INNER JOIN user u ON u.id = ugc.id_user
                                                  WHERE ugc.id_game = :id_game AND ugc.id_cycle = :id_cycle
                                                  ORDER BY  ugc.hits DESC, ugc.points DESC
                                                  LIMIT :top");

            $statement->bindParam(":id_game", $id_game);
            $statement->bindParam(":top", $top);
            $statement->bindParam(":id_cycle", $id_cycle);

            $statement->execute();

            $in_top = false;

            foreach ($statement->fetchAll(PDO::FETCH_ASSOC) as $row) {

                if ($row["id"] == $id_user) {
                    $in_top = true;
                }

                array_push($ranking, array("id" => $row["id"], "nickname" => $row["nickname"], "points" => $row["points"]));
            }

            //If the user is not in the top 3.
            if (!$in_top) {
                $statement = $db->connect()->prepare("SELECT u.id, u.nickname, ugc.points
                                                      FROM user_game_cycle ugc
                                                      INNER JOIN user u ON u.id = ugc.id_user
                                                      WHERE ugc.id_game = :id_game AND ugc.id_user = :id_user AND ugc.id_cycle = :id_cycle
                                                      LIMIT 1");

                $statement->bindParam(":id_game", $id_game);
                $statement->bindParam(":id_user", $id_user);
                $statement->bindParam(":id_cycle", $id_cycle);

                $statement->execute();

                if ($statement->rowCount() > 0) {
                    $ranking_user = $statement->fetch(PDO::FETCH_ASSOC);
                }
            }

            Response::send(array("msg" => "Ok.", "data" => $ranking, "data_user" => $ranking_user), Response::HTTP_OK);
        } else {
            Response::send(array("msg" => "Miss params."), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    } catch (PDOException $e) {
        Response::send(array("msg" => "An unexpected error has occurred: " . $e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}

function insert()
{
    $is_new_record = false;
    $id_game = isset($_POST["id_game"]) ? $_POST["id_game"] : -1;
    $id_user = isset($_POST["id_user"]) ? $_POST["id_user"] : -1;
    $id_cycle = isset($_POST["id_cycle"]) ? $_POST["id_cycle"] : -1;
    $points = isset($_POST["points"]) ? $_POST["points"] : -1;

    try {
        if ($id_game !== -1 && $id_user !== -1 && $id_cycle !== -1 && $points !== -1) {
            $db = new Database();

            $statement = $db->connect()->prepare("SELECT u.id, u.nickname, ugc.points
                                                  FROM user_game_cycle ugc
                                                  INNER JOIN user u ON u.id = ugc.id_user
                                                  WHERE ugc.id_user = :id_user AND ugc.id_game = :id_game
                                                  LIMIT 1");

            $statement->bindParam(":id_user", $id_user);
            $statement->bindParam(":id_game", $id_game);

            $statement->execute();

            if ($statement->rowCount() > 0) {
                //If exists score game.
                $current_ranking_user = $statement->fetch(PDO::FETCH_ASSOC);

                //If have new record.
                if ($current_ranking_user && ($current_ranking_user["points"] < $points)) {
                    $statement = $db->connect()->prepare("UPDATE user_game_cycle SET points = :points WHERE id_user = :id_user AND id_game = :id_game AND id_cycle = :id_cycle");

                    $statement->bindParam(":points", $points);
                    $statement->bindParam(":id_user", $id_user);
                    $statement->bindParam(":id_game", $id_game);
                    $statement->bindParam(":id_cycle", $id_cycle);

                    $statement->execute();
                    
                    $is_new_record = true;
                }
            } else {
                //If not exists score game.
                $statement = $db->connect()->prepare("INSERT INTO user_game_cycle (id_user, id_game, id_cycle, points, hits) VALUES (:id_user, :id_game, :id_cycle, :points, :hits)");

                $statement->bindParam(":id_user", $id_user);
                $statement->bindParam(":id_game", $id_game);
                $statement->bindParam(":id_cycle", $id_cycle);
                $statement->bindParam(":points", $points);

                $statement->execute();
            }

            Response::send(array("msg" => "Ok.", "is_new_record" => $is_new_record), Response::HTTP_OK);
        } else {
            Response::send(array("msg" => "Miss params"), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    } catch (PDOException $e) {
         Response::send(array("msg" => "An unexpected error has occurred: " . $e->getMessage()), Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
