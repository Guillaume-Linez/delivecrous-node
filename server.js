import express, { query } from 'express'
import mongoose from 'mongoose'

const app = express()

app.use(express.json())

var url = "mongodb://localhost:27017/test"
mongoose.connect(url)
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - '));

const Plat = mongoose.model("Plat", {name: String, prix: Number})
const Cart = mongoose.model("Cart", {plat: JSON, qte: Number})

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

//Ajout d'un plat dans le cadie
app.post("/cart/:id", (req, res) => {
    var plat_actuel
    Plat.findById(req.params.id)
    .then((Plat) => new Cart({"plat":Plat, "qte":3}).save().then((Cart) => res.json(Cart)))
})

// Supression d'un article
app.delete("/cart/:id", async (req, res) => {
    Cart.findOneAndDelete(req.params.id)
      .then((Plat) => res.json(Plat))
      .catch(() => res.status(404).end())
  })

// Update one by ID
app.put("/plats/:id", async (req, res) => {
  Plat.findByIdAndUpdate(req.params.id, req.body)
    .then((Plat) => res.json(Plat))
    .catch(() => res.status(404).end())
})

// Delete one by ID
app.delete("/plats/:id", async (req, res) => {
  Plat.findOneAndDelete(req.params.id)
    .then((Plat) => res.json(Plat))
    .catch(() => res.status(404).end())
})

app.get("*", (req, res) => {
  res.status(404).end()
})

app.listen(3000)