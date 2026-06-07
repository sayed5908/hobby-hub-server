const express = require('express')
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

app.use(cors());
app.use(express.json());

//YDkiaoG6szXd9BlN
//hobby-hub


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skmy7gb.mongodb.net/?appName=Cluster0`;

// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db('hobbyDB').collection('users');
    const groupCollection = client.db('hobbyDB').collection('groups');

    //user related api
    app.post('/users', async(req, res) =>{
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    })



    app.patch('/users', async(req, res)=> {
      const {email, lastSignInTime} = req.body;
      const filter = {email: email}
      const updatedDoc = {
        $set: {
          lastSignInTime: lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

   

    //get user info from database
    app.get('/users', async(req, res) =>{
      const user = await usersCollection.find().toArray();
      res.send(user);
    })

     //group related apis

    app.post('/groups', async(req, res)=>{
      const groupInfo = req.body;
      const result = await groupCollection.insertOne(groupInfo);
      res.send(result);
    })

    app.get('/groups', async(req, res) =>{
      const group = await groupCollection.find().toArray();
      res.send(group);
    })

    app.get('/groups/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await groupCollection.findOne(query);
      res.send(result);
    })

    //find groups using email
    app.get('/groups/:email', async(req, res)=>{
      const email = req.params.email;

      const query = {userMail : email};

      const result = await groupCollection.findOne(query).toArray();
      res.send(result);
    })

    //update group

    app.put('/groups/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateGroup = req.body;
      const updatedDoc = {
        $set: updateGroup
      }
      const result = await groupCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    //delete group
    app.delete('/groups/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await groupCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`Hobby hub is running on port ${port}`)
})
