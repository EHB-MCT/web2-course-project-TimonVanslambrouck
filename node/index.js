const express = require("express");
const app = express();
const pokeRouter = express.Router();
const port = process.env.PORT || 3000;
let db = null;
let collection = null;

/* 
    GET /pokemon = Get all pokemon
    GET /pokemon?type=normal = Get specific pokemon list
    GET /pokemon/:uniqueidentifier123 = Get a single pokemon based on a unique ID/Identifier
 
    The next routes have object data in their request bodies
    POST /pokemon = save a pokemon in the database
    PUT /pokemon = save a pokemon, replacing everything
    PATCH /pokemon = save a pokemon, replacing only the fields neccesary
    DELETE /pokemon = delete a pokemon, based on id
*/

pokeRouter.route('/pokemon')
    .get((req, res) => {
        collection = db.collection("pokemonList");
        const result = collection.find().toArray();
        res.json(result);
        collection.find({}).toArray((error, result) => {
            if (error) {
                throw error;
            }
            // res.json(result);
        });
    });

app.get('/', (req, res) => {
    res.send('Welcome on the page');
});

app.use('/api', pokeRouter);

app.listen(port, () => {
    console.log(`Running on port ${port}`);
    client.connect(err => {
        if (err) {
            throw err;
        }
        db = client.db(DB_NAME);
        console.log(`Connected to database: ${DB_NAME}`);
    });
});

// MongoDB

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0.9ryim.mongodb.net/pokemonList?retryWrites=true&w=majority";
const DB_NAME = "pokemonList";
const client = new MongoClient(uri, {
    useNewUrlParser: true
});

async function addPokemon(pokemon) {
    //addPokemon(pokemon).catch(console.dir);
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(DB_NAME);

        const col = db.collection("pokemon");
        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(pokemon);
        // Find one document
        const myDoc = await col.findOne();
        // Print to the console
        console.log(myDoc);

    } catch (err) {
        console.log(err.stack);
    }
}