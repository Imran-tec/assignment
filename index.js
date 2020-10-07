
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0jhuw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = 5000

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))



app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

client.connect(err => {
  const collection = client.db("volunterDatabase").collection("volunteerCollection");
  const orderCollection = client.db("volunterDatabase").collection("taskOrder");



  app.post('/addtask',(req,res) => {
    const task = req.body;
   console.log(task)
    orderCollection.insertOne(task)
    .then(result =>{
      console.log((result.insertedCount))
      
    })
  })

  
  app.post('/addevent',(req,res) => {
    const event = req.body;
   console.log(event)
    collection.insertOne(event)
    .then(result =>{
      console.log((result.insertedCount))
      
    })
  })


app.get('/task',(req, res)=> {
  collection.find({})
  .toArray((err,documents) => {
    res.send(documents)
  })
})

app.get('/orderedTasks',(req, res)=> {
 console.log(req.query.title)
 collection.find({title: req.query.title})
 .toArray((err,documents) => {
   console.log(err)
   console.log(documents)
   res.send(documents)
 })
})

app.get('/admin',(req, res) => {
  orderCollection.find({})
  .toArray((err,documents) => {
    res.send(documents)
  })
})

app.delete('/cancel/:id', (req, res) => {
  console.log(req.params.id)
  orderCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result =>{
    console.log(result)
  })
})

app.get('/userOrder',(req, res) => {
  orderCollection.find({email:req.query.email})
  .toArray((err,documents) => {
    res.send(documents)
  })
})
  
});



app.listen(process.env.PORT || port )