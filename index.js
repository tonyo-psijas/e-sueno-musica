const express = require("express");
const fs = require("fs");
const cors = require("cors")
const app = express();

app.use(express.json());

app.use(cors());

app.listen(3001, console.log("Servidor funcionando en el puerto 3001"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

app.get("/canciones/", (req, res) => {

    const canciones = JSON.parse(fs.readFileSync("canciones.json", "utf-8"))

    res.json(canciones)

});

app.get("/canciones/:id", (req, res) => {
    const { id } = req.params

    const allCanciones = JSON.parse(fs.readFileSync("canciones.json", "utf-8"))
    const cancionAMostrar = allCanciones.find((c) => c.id == id)

    if (!cancionAMostrar) {
        return res.status(404).json({ mensaje: "La canción que buscas no est'a disponible" })
    }

    res.json(cancionAMostrar)

});

app.post("/canciones", (req, res) => {
    const allCanciones = JSON.parse(fs.readFileSync("canciones.json", "utf-8"))

    let id = allCanciones.length + 1

    const cancionNueva = {
        id,
        titulo: req.body.titulo,
        artista: req.body.artista,
        tono: req.body.tono
    }

    allCanciones.push(cancionNueva)

    fs.writeFileSync("canciones.json", JSON.stringify(allCanciones))

    res.json(allCanciones)

    console.log(cancionNueva)
});

app.put("/canciones/:id", (req, res) => {
    const { id } = req.params

    const { titulo, artista, tono } = req.body
    
    const allCanciones = JSON.parse(fs.readFileSync("canciones.json", "utf-8"))

    let indiceCancion = allCanciones.findIndex((c) => c.id == id)

    let cancionActualizada = {
        id: Number(id),
        titulo,
        artista,
        tono
    }

    allCanciones[indiceCancion] = cancionActualizada

    fs.writeFileSync("canciones.json", JSON.stringify(allCanciones))

    res.json(cancionActualizada)

    console.log(cancionActualizada)
});

app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params

    const allCanciones = JSON.parse(fs.readFileSync("canciones.json", "utf-8"))

    let indiceCancion = allCanciones.findIndex((c) => c.id == id)

    const cancionEliminada = allCanciones.splice(indiceCancion, 1)

    fs.writeFileSync("canciones.json", JSON.stringify(allCanciones))

    res.json({
        mensaje: "Has eliminado una canción",
        producto: cancionEliminada[0]
    })

})