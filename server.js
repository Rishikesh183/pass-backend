/* eslint-disable no-undef */
const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb');
dotenv.config()
const app = express()
const port = 3000
const cors = require('cors')
app.use(bodyParser.json())
app.use(cors())

const { MongoClient } = require('mongodb')
const client = new MongoClient(process.env.MONGO_URI)
const database = 'MyPasswords';

client.connect()
app.get('/', async (req, res) => {
    const db = client.db(database)
    const collection = db.collection('passwords')
    const findResult = await collection.find({}).toArray()
    res.json(findResult)
})

app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(database)
    const collection = db.collection('passwords')
    const SavedPass = await collection.insertOne(password)
    res.send({success:true})
})


app.delete('/', async (req, res) => {
  const { _id } = req.body;
  console.log("Deleting ID:", _id); // should print a string like "661f7bdfd8bd26a9fe91b3d2"

  try {
    const db = client.db(database);
    const collection = db.collection('passwords');

    const result = await collection.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 1) {
      console.log("Deleted successfully");
      res.send({ success: true });
    } else {
      console.log("No document found to delete.");
      res.send({ success: false, message: "No matching document." });
    }
  } catch (err) {
    console.error("Error deleting:", err);
    res.status(500).send({ success: false, error: "Server error" });
  }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})