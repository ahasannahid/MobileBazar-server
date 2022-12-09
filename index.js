const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbh9oi5.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('mobileBazar').collection('users');
        const categoryCollection = client.db('mobileBazar').collection('category');
        const productsCollection = client.db('mobileBazar').collection('products');
        const bookingCollection = client.db('mobileBazar').collection('booking');

        app.get('/category', async (req, res) => {
            const query = {};
            const category = await categoryCollection.find(query).toArray();
            res.send(category);
        });

        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        // "start-dev": "nodemon index.js",

        app.get('/category/:name', async (req, res) => {
            const category = req.params.name;
            console.log(category);

            const query = {
                category:category
            }

            const category_products = await productsCollection.find(query).toArray();
            res.send(category_products);
        });

        app.get('/role/:category', async (req, res) => {
            const category = req.params.category;
            console.log(category);

            const query = {
                category:category
            }

            const category_user = await usersCollection.find(query).toArray();
            res.send(category_user);
        });

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        });
        app.get('/myproducts', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = { email: email };
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })


        app.post('/users', async (req, res) => {
            const user = req.body;
            // console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });

        app.post('/products',  async(req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });


        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.category === 'admin' });
        });

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.category === 'Seller' });
        });

        app.delete('/users/:id', async (req,res) => {
            const id = req.params.id;
            console.log(id)
            const query = {_id:ObjectId(id)};
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })

       
    }
    finally {

    }
}

run().catch(console.log)


app.get('/', async (req, res) => {
    res.send('Buy Sell server is running');
})

app.listen(port, () => console.log(`Buy Sell running on ${port}`))