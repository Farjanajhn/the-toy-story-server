const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 4000;

//middleWare
app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iqsr3w7.mongodb.net/?retryWrites=true&w=majority`;

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
    const productCollection = client.db('toyStory').collection('products');


 //get data
    app.get('/products', async (req, res)=> {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    //post data
    app.post('/addProduct', async (req, res) => {
      const body = req.body;
      const result = await productCollection.insertOne(body);
      res.send(result)
      console.log(result)
    })
    

    //my toy
    app.get('/products', async (req, res) => {
      console.log(req.query.email)
     let query = {}; 
      if (req.query?.email) {
        query = {email:req.query.email}
      } 
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
       res.send(result); 
/*       console.log(result); */
     
    })



    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   /*  await client.close(); */
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('toy is running')
})

app.listen(port, () => {
  console.log(`toy server is running on port ${port}`)
}) 