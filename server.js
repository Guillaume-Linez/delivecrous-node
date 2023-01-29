//Guillaume Linez FISA-3 INFO
//Imports
import express, { query } from 'express'
import mongoose from 'mongoose'
import cors from 'cors';

const app = express()
app.use(express.json())
app.use(cors())
console.log('server.js connected')

//var
var port = 2000;
var folderPath = "C:/Users/guill/delivecrous-node/";

//Initialisation de la bdd mongoDB
var url = "mongodb://localhost:27017/test"
mongoose.connect(url)
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - '));

const Plat = mongoose.model("Plat", {name: String, prix: Number, alergene: String})
const Cadie = mongoose.model("Cadies", {plat: JSON, qte: Number, id_user: Number})
const User = mongoose.model("User", {nom: String, prenom: String, id_user: Number})
const Commande = mongoose.model("Commande", {id_user: Number, Adresse: String})

//Plats
// Creation d'un plat (à enlever pour empecher l'user de l'utiliser)
app.post("/plats", (req, res) => {
    const PlatToSave = new Plat({"name":req.query.name, "prix":req.query.prix, "alergene":req.query.alergene})
    PlatToSave.save().then((Plat) => res.json(Plat))
})

//suprimme un plat avec son id
app.delete("/plats/:id", async (req, res) => {
  Plat.findOneAndDelete({'_id':req.params.id})
    .then((Plat) => res.json(Plat))
    .catch(() => res.status(404).end())
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
    Cadie.findOneAndDelete({'_id':req.params.id})
      .then((Cadie) => res.json(Cadie))
      .catch(() => res.status(404).end())
  })

// Supression du cadie d'un user
app.delete("/Cadie/deleteall/:id_user", async (req, res) => {
    Cadie.remove({'id_user':req.params.id_user})
      .then((Cadie) => res.json(Cadie))
      .catch(() => res.status(404).end())
  })

//Récupération de tout les cadies
app.get("/Cadie", async (req, res) => {
    Cadie.find()
        .then((Cadie) => res.json(Cadie))
        .catch(() => res.status(404).end())
})

//récupération d'un cadie
app.get("/Cadie/:id", async (req, res) => {
    Cadie.find({id_user: req.params.id})
        .then((Cadie) => res.json(Cadie))
        .catch(() => res.status(404).end())
})

//Ajout d'un user
app.post("/user", (req, res) => {
  const UserToSave = new User({"nom":req.query.nom, "prenom":req.query.prenom, "id_user":req.query.id_user})
  UserToSave.save().then((User) => res.json(User))
})

//Récupération de tout les users
app.get("/user", async (req, res) => {
  User.find()
    .then((user) => res.json(user))
    .catch(() => res.status(404).end())
})

//Supression d'un user
app.delete("/user/:id", async (req, res) => {
    User.findOneAndDelete({'id_user':req.params.id})
      .then((User) => res.json(User))
      .catch(() => res.status(404).end())
  })

//passage d'une commande
app.post("/commande", (req, res) => {
  const CommandeToSave = new Commande({"id_user":req.query.id_user, "Adresse":req.query.adresse})
  CommandeToSave.save().then((Commande) => res.json(Commande))
})

app.get("*", (req, res) => {
  res.status(404).end()
})

app.listen(port)