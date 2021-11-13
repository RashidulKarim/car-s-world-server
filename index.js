const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();


app.use(express.json())
// app.use(cors())
const corsOptions = {
    origin: 'https://cars-world-b8cea.web.app/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djl2y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async() =>{
    try{
        await client.connect()
        const carsWorld = client.db("cars-world")
        const productCollection = carsWorld.collection("Products")
        const reviewCollection = carsWorld.collection("Reviews")
        const orderCollection = carsWorld.collection("orders")
        const userCollection = carsWorld.collection("Users")

        //add product to database
        app.post("/addProduct", cors(corsOptions),async(req, res, next)=>{
            const productData = req.body?.body
            const result =await productCollection.insertOne(productData)
            res.send(result)
        })

        //get all products from database
        app.get("/products", cors(corsOptions),async(req, res, next)=>{
            const result = await productCollection.find({}).toArray()
            res.send(result)
            
        })
        //Delete product from database
        app.delete("/product", cors(corsOptions),async(req, res, next)=>{
            const query = {_id: ObjectId(req.query.id)}
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })
        //find single product from database
        app.get("/product", cors(corsOptions),async(req, res, next)=>{
            const query = {_id: ObjectId(req.query.id)}
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        //add review to database
        app.post("/addReview", cors(corsOptions),async(req, res, next)=>{
            const reviewData = req.body?.body
            const result =await reviewCollection.insertOne(reviewData)
            res.send(result)
        })

        //get all reviews from database
        app.get("/reviews", cors(corsOptions),async(req, res, next)=>{
            const result = await reviewCollection.find({}).toArray()
            res.send(result)
            
        })
        //Add order to database
        app.post("/order", cors(corsOptions),async(req, res, next)=>{
            const orderInfo = req.body.orderDetails            
            const result = await orderCollection.insertOne(orderInfo)
            res.send(result)
        })
        //find a single user order
        app.get("/orders", cors(corsOptions),async(req, res, next)=>{
            const query = {email: req.query.email}                       
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })
        //find  all user order
        app.get("/allOrders", cors(corsOptions),async(req, res, next)=>{
            const result = await orderCollection.find({}).toArray();
            res.send(result)
        })
        //Delete order from data base
        app.delete("/order", cors(corsOptions),async(req, res, next)=>{
            const query = {_id: ObjectId(req.query.id)}
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })

        // change a order status
        app.put('/order', cors(corsOptions),async(req, res, next)=>{
            const status = req.query.status
            const orderInfo = req.body
            const filter = {_id: ObjectId(orderInfo._id)}
            const updateDoc = {
                $set: {
                  status: status
                }
              }
            const result = await orderCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        // add user to database
        app.post('/users', cors(corsOptions),async(req, res, next)=>{
            const data = req.body
            const result = await userCollection.insertOne(data)
            res.send(result)
        })
        
        // make an user as admin
        app.put('/users', cors(corsOptions),async(req, res, next)=>{
            const filter = {email: req.query.email}
            const updateDoc = {
                $set: {
                  role: "admin"
                }
              }
              const result = await userCollection.updateOne(filter, updateDoc);
              res.send(result)
        })

         // find a user
         app.get('/users', cors(corsOptions),async(req, res, next)=>{
            const filter = {email: req.query.email}
            const result = await userCollection.findOne(filter)
            res.send(result)
         })
    }
    finally{
        // client.close();
    }
}

run().catch(err=>console.log(err)
)


app.get('/', (req,res) =>{
    res.send("Welcome to cars world server")
})

app.listen(port, ()=>{
    console.log('listening from port', port)
})