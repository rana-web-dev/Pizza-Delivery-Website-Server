const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.a8e9r20.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const pizzaCollection = client.db("pizzaDelivery").collection("services");
    const reviewCollection = client.db("pizzaDelivery").collection("review");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = pizzaCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/review", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    app.post("/review", async (req, res) => {
      const service = req.body;
      await reviewCollection.insertOne(service);
      res.send(req.body);
    });

    app.post("/services", async (req, res) => {
      const newService = req.body;
      console.log(newService);
      await pizzaCollection.insertOne(newService);
      res.send(req.body);
    });

    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((error) => console.log(error));


app.listen(port, () => {
  console.log("Running Express Server On: ", port);
});
