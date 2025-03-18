const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    database: "animals",
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies

app.get("/", (req, res) => {
    res.send("Hello World!");
});

connection.connect();
app.get("/get-animals", (req, res) => {
    connection.query(
        `
    SELECT 
        animals.AnimalID, 
        animals.AnimalName, 
        animals.age, 
        habitats.HabitatID, 
        habitats.HabitatName, 
        habitats.Climate, 
        species.SpeciesID, 
        species.SpeciesName, 
        species.ScientificName 
    FROM animals
    LEFT JOIN habitats ON animals.HabitatID=habitats.HabitatID 
    LEFT JOIN species ON animals.SpeciesID=species.SpeciesID;
    `,
        (err, animals) => {
            if (err) throw err;
            return res.json(animals);
        }
    );
});

app.post("/add-animal", (req, res) => {
    const newAnimal = {
        AnimalName: req.body.animalName,
        age: req.body.age,
        HabitatID: req.body.habitatId,
        SpeciesID: req.body.speciesId,
    };
    connection.query(
        `INSERT INTO animals (AnimalName, age, HabitatID, SpeciesID) VALUES (?, ?, ?, ?)`,
        [newAnimal.AnimalName, newAnimal.age, newAnimal.HabitatID, newAnimal.SpeciesID],
        (err, result) => {
            if (err) throw err;
            res.json({ success: true, animalId: result.insertId });
        }
    );
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
