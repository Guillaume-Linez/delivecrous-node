//Guillaume Linez FISA-3 INFO
//Imports
import express, { query } from 'express'
import mongoose from 'mongoose'

const app = express()

app.use(express.json())

//Initialisation de la bdd mongoDB
var url = "mongodb://localhost:27017/test"
mongoose.connect(url)
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - '));

const Plat = mongoose.model("Plat", {name: String, prix: Number})
const Cadie = mongoose.model("Cadies", {plat: JSON, qte: Number, id_user: Number})
const Cadie_by_user = mongoose.model("Cadie_by_users",{ adresse: String, cadie: JSON, id_user: Number})

//Plats
// Creation d'un plat (à enlever pour empecher l'user de l'utiliser)
app.post("/plats", (req, res) => {
    const PlatToSave = new Plat({"name":req.query.name, "prix":req.query.prix})
    PlatToSave.save().then((Plat) => res.json(Plat))
})

// Récupération de tout les plats
app.get("/plats", async (req, res) => {
  Plat.find()
    .then((plats) => res.json(plats))
    .catch(() => res.status(404).end())
})

// Récupération d'un plat par ID
app.get("/plats/:id", async (req, res) => {
  Plat.findById(req.params.id)
    .then((Plat) => res.json(Plat))
    .catch(() => res.status(404).end())
})

//Cadie
//Ajout d'un plat dans le cadie
app.post("/Cadie/:id", (req, res) => {
    Plat.findById(req.params.id)
    .then((Plat) => new Cadie({"plat":Plat, "qte":req.query.quantite, "id_user": req.query.id_user}).save().then((Cadie) => res.json(Cadie)))
})

// Supression d'un article cadie
app.delete("/Cadie/:id", async (req, res) => {
    Cadie.findOneAndDelete(req.params.id)
      .then((Plat) => res.json(Plat))
      .catch(() => res.status(404).end())
  })

//Récupération de tout les cadies
app.get("/Cadie", async (req, res) => {
    Cadie.find()
        .then((Cadie) => res.json(Cadie))
        .catch(() => res.status(404).end())
})

app.get("/Cadie/:id", async (req, res) => {
    Cadie.find({id_user: req.params.id})
        .then((Cadie) => res.json(Cadie))
        .catch(() => res.status(404).end())
})

//Cadie_by_users
app.post("/Cadie_final/user/:id", (req, res) => {
    console.log("test")
    console.log(req.params.id)
    console.log(req.query.adresse)
    Cadie.find({id_user: req.params.id})
    .then((Cadie) => new Cadie_by_user({"adresse":req.query.adresse, "cadie":Cadie, "id_user": req.params.id}).save().then((Cadie_by_user) => res.json(Cadie_by_user)))
})

// Update one by ID
app.put("/plats/:id", async (req, res) => {
  Plat.findByIdAndUpdate(req.params.id, req.body)
    .then((Plat) => res.json(Plat))
    .catch(() => res.status(404).end())
})

app.get("*", (req, res) => {
  res.status(404).end()
})

app.listen(3000)