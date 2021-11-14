const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@cluster0.j2pnz.mongodb.net/vilastate?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const db = client.db("vilastate");

    const vilas = db.collection("vilas");
    const users = db.collection("users");
    const reviews = db.collection("reviews");
    const orders = db.collection("orders");

    app.get("/vilas", async (req, res) => {
      const response = await vilas.find({}).toArray();
      res.send(response);
    });

    app.post("/vila", async (req, res) => {
      const data = req.body;
      const response = await vilas.insertOne(data);
      res.send(response);
    });

    app.delete("/vila", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const result = await vilas.deleteOne(query);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { email: email };
      }
      const response = await orders.find(query).toArray();
      res.json(response);
    });

    app.post("/order", async (req, res) => {
      const data = req.body;
      const response = await orders.insertOne(data);
      res.send(response);
    });

    app.delete("/order", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const response = await orders.deleteOne(query);
      res.send(response);
    });

    app.get("/reviews", async (req, res) => {
      const response = await reviews.find({}).toArray();
      res.send(response);
    });

    app.post("/review", async (req, res) => {
      const data = req.body;
      const response = await reviews.insertOne(data);
      res.send(response);
    });

    app.post("/user", async (req, res) => {
      const data = req.body;
      const response = await users.insertOne(data);
      res.send(response);
    });

    app.get("/user", async (req, res) => {
      const email = req.query.email;
      const filter = { email: email };
      const response = await users.findOne(filter);
      res.send(response);
    });

    app.put("/user", async (req, res) => {
      const email = req.query.email;
      const filter = { email: email };
      const updateDoc = { $set: { role: "admin" } };
      const response = await users.updateOne(filter, updateDoc);
      res.json(response);
    });
  } finally {
    //   await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Working Or NOT?");
});

app.listen(PORT, () => {
  console.log(`App is Running on Port ${PORT}`);
});
