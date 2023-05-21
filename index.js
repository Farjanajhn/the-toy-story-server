const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
      const cursor = productCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    })  
     

    //post data
    app.post('/addProduct', async (req, res) => {
      const body = req.body;
     /*  body.createAt = new Price(); */
      const result = await productCollection.insertOne(body);
      res.send(result)
      console.log(result)
    })
    

    //my toy
   app.get('/myProducts', async (req, res) => {
     console.log(req.query.email) 
     let query = {}; 
      if (req.query?.email) {
        query = {email:req.query.email}
      } 
     const cursor = productCollection.find(query);
  /*    sortBy({createAt:1}) */
      const result = await cursor.toArray();
       res.send(result); 
   /*  console.log(result);  */
      
   }) 
    
    //data for single toy
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = {
        projection: { price:1,photo:1, toyName:1, name:1, email:1, rating:1, quantity:1,description:1}
      }
      const result = await productCollection.findOne(query,options);
      res.send(result)
    })


    //updateProduct
    
    app.put('/updateProducts/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedToy = req.body;
      const toy = {
        $set: {
          
          price: updatedToy.price,
          quantity: updatedToy.quantity,
       description:updatedToy.description
        }
      }
      const result = await productCollection.updateOne(filter, toy, options);
      res.send(result);
    })
    
 
    app.delete('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.deleteOne(query)
      res.send(result);

    })





   /*  await client.connect(); */
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