const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const startServerAndDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started http://localhost:3000/");
    });
  } catch (e) {
    console.log("DB Error");
    process.exit(1);
  }
};

startServerAndDB();

// GET PLAYERS

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT *
    FROM cricket_team
    ORDER BY player_id;
    `;

  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});
module.exports = app;
// CREATE PLAYER

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseynumbet, role } = playerDetails;
  const addPlayerQuery = `
  INSERT INTO 
  cricket_team (player_name, jersey_number, role)
  VALUES 
  ('${playerName}', ${jerseyNumber}, '${role}');
  `;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});
module.exports = app;

// GET PLAYER

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  respone.send(player);
});
module.exports = app;

//UPDATE PLAYER

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const updatePlayerQuery = `
  UPDATE
    cricket_team 
  SET 
    player_name = '${playerName}', 
    jersey_number = ${jerseyNumber}, 
    role = '${role}'
  WHERE
    player_id = ${playerId};`;

  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});
module.exports = app;

//DELETE PLAYER

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteBookQuery = `
    DELETE FROM 
        cricket_team
    WHERE 
        player_id = ${playerId};`;
  await db.run(deleteBookQuery);
  response.send("Player Removed");
});
module.exports = app;
