// <<<<<<<<<<< dependencies start >>>>>>>>>
const express = require('express')

const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
// <<<<<< dependencies app use>>>>
const app = express();
// app.use(ObjectID);
app.use(bodyParser.json());
app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    })
)
// <<<<<<<< dependencies end>>>

const port =  5000;
// <<<< connecting Application>>>>>
const uri = "mongodb+srv://doctordb:doctordb121@cluster0.fob1y.mongodb.net/doctorPortal?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true },(error)=>error && console.log(error));
  client.connect(err => {
    const bookAppointmentCollection = client.db("doctorsPortal").collection("bookAppointment");
    const addingDoctorCollection = client.db("doctorsPortal").
    collection("addDoctor") 
    const makingAdminCollection = client.db("doctorsPortal").
    collection("addAdmin") 
  
    // .......book appointment post method......
    app.post("/bookAppointment", (req, res) => {
        const addBookAppointment = req.body;
        console.log(addBookAppointment);
        bookAppointmentCollection.insertOne(addBookAppointment)
            .then(result => {
                res.send(result.insertedCount>0)
            })
    });
    //  ...... book appointment get method.......
    app.get('/gettingBookAppointment',(req,res)=>{
        bookAppointmentCollection.find({})
        .toArray((err, documents) => res.send(documents))
    });

    // ....... book appointment action fetching....
    app.patch('/updateAppointment', (req, res)=>{
        console.log(req.body)
        bookAppointmentCollection.updateOne(
            {_id: ObjectId(req.body.id)},
            { $set: {"status" : req.body.status }}
        )
        .then(result => {
            res.send(result.modifiedCount > 0)
             
        })
    });


    app.post("/addDoctor", (req, res) => {
        const addDoctor = req.body;
        console.log(addDoctor);
        addingDoctorCollection.insertOne(addDoctor)
            .then(result => {
                res.send(result.insertedCount>0)
            })

    });
    app.get('/getOurDoctor',(req,res)=>{
        addingDoctorCollection.find({})
        .toArray((err, documents) => res.send(documents))
    });
    app.patch('/prescriptionUpdating', (req,res) =>{
        console.log(req.body);
        bookAppointmentCollection.updateOne(
            {_id: ObjectId(req.body.id)},
            { $set: {"prescription" : req.body.prescription }}
        )
        .then(result=>{
            console.log(result)
        })
    })

    app.patch('/visitedUpdatingData', (req,res) =>{
        // console.log(req.body);
        bookAppointmentCollection.updateOne(
            {_id: ObjectId(req.body.id)},
            { $set: {"visited" : req.body.visited }}
        )
        .then(result=>{
            console.log(result)
        })
    })

    // <<<<<<<< Making a Admin >>>>>>
    
    app.post("/makingAdmin", (req, res) => {
        const makeAdmin = req.body;
        // console.log(makeAdmin);
        makingAdminCollection.insertOne(makeAdmin)
            .then(result => {
                res.send(result.insertedCount>0)
            })
    });
    // <<<<<<<<< getting Admin >>>>
    // app.get('/getAdmin',(req,res)=>{
    //     makingAdminCollection.find({})
    //     .toArray((err, documents) => res.send(documents))
    // });
    app.post('/getAdmin', (req,res)=>{
        const email = req.body.email;
        makingAdminCollection.find({email:email})
        .toArray((err, documents) => {
             res.send(documents.length > 0)
        })
        // console.log(admin)
      })
    // <<<<<  Express js Get methods >>>>>>
    app.get('/', (req, res) => {
        res.send('Hello World!')
      });
  });
  app.listen(port);