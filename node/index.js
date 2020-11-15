const bodyParser = require('body-parser');
const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());
const pokeRouter = express.Router();
const port = process.env.PORT || 3000;
let db = null;
let collection = null;

// MongoDB
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0.9ryim.mongodb.net/pokemonList?retryWrites=true&w=majority";
const DB_NAME = "pokemonList";
const client = new MongoClient(uri, {
    useNewUrlParser: true
});
const ObjectId = require('mongodb').ObjectID;

// BODYPARSER

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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

pokeRouter.route('/pokemon').get((req, res) => {
    collection = db.collection("pokemon");
    const query = {};
    if (req.query.form) {
        query.form = req.query.form;
    } else if (req.query.name) {
        query.name = req.query.name;
    } else if (req.query.type) {
        query.type = req.query.type;
    }

    collection.find(query).toArray((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
}).post((req, res) => {
    collection = db.collection("pokemon");
    collection.insertOne(req.body).then(result => {
        console.log(result);
    });
    res.send('Data has been sent to collection');
});

pokeRouter.route('/pokemon/:pokemonId').get((req, res) => {
    collection = db.collection("pokemon");
    // Source: https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    if (req.params.pokemonId.match(/^[0-9a-fA-F]{24}$/) === null) {
        return res.send('This Pokémon ID does not exist!');
    }
    const query = {
        _id: ObjectId(req.params.pokemonId)
    }
    collection.find(query).toArray((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.json(result);
    })
});

app.get('/', (req, res) => {
    res.send('Welcome on the page');
});

app.use('/api', pokeRouter);

app.get('/pokemon/:id', (req, res) => {

});

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