const path = require('path');
const bodyParser = require('body-parser');
const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());
const pokeRouter = express.Router();
const port = process.env.PORT || 4000;
let db = null;
let collection = null;


// MongoDB

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://admin:admin@cluster0.9ryim.mongodb.net/pokemonList?retryWrites=true&w=majority`;
const DB_NAME = "pokemonList";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
        if (req.query.shiny) {
            query.type = req.query.type
            query.shiny = req.query.shiny;
        } else if (req.query.cp) {
            query.type = req.query.type;
            query.cp = req.query.cp
        } else {
            query.type = req.query.type;
        }
    } else if (req.query.cp) {
        if (req.query.type) {
            query.type = req.query.type;
            query.cp = req.query.cp;
        }
        query.cp = req.query.cp;
    } else if (req.query.shiny) {
        if (req.query.type) {
            query.type = req.query.type
            query.shiny = req.query.shiny;
        } else {
            query.shiny = req.query.shiny;
        }
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
            return res.send('Not a valid ID!');
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
    })
    .put((req, res) => {
        collection = db.collection("pokemon");
        const query = {
            _id: ObjectId(req.params.pokemonId)
        }

        // SOURCE: https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/
        const update = {
            "$set": {
                "cp": req.body.cp
            }
        }
        const options = {
            "upsert": false
        }
        return collection.findOneAndUpdate(query, update, options)
            .then(updatedDocument => {
                return res.sendStatus(200);
            })
            .catch(err => console.error(`Failed to find and update document: ${err}`))
    })
    .patch((req, res) => {
        collection = db.collection("pokemon");
        const query = {
            _id: ObjectId(req.params.pokemonId)
        };
        const update = {
            "_id": ObjectId(req.params.pokemonId),
            "id": req.body.id,
            "name": req.body.name,
            "form": req.body.form,
            "type": req.body.type,
            "shiny": req.body.shiny,
            "cp": req.body.cp,
            "evolution": req.body.evolution,
            "distance": req.body.distance,
            "picture": req.body.picture,
            "attack": req.body.attack,
            "defense": req.body.defense,
            "hp": req.body.hp
        };
        collection.replaceOne(query, update)
            .then(updatedDocument => {
                return res.sendStatus(200);
            })
            .catch(err => console.error(`Error: ${err}`))

    })
    .delete((req, res) => {
        collection = db.collection("pokemon");
        const query = {
            _id: ObjectId(req.params.pokemonId)
        };
        collection.deleteOne(query);

        return res.sendStatus(204);
    })

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/info.html'));
});

app.use('/api', pokeRouter);

app.listen(port, () => {
    console.log(`Running on port ${port}, http://localhost:${port}/api/pokemon`);
    client.connect(err => {
        if (err) {
            throw err;
        }
        db = client.db(DB_NAME);
        console.log(`Connected to database: ${DB_NAME}`);
    });
})

// pokeRouter.route('/createUser')
//     .post((req, res) => {
//         let user = {
//             user: "Jos",
//             pwd: "Test",
//             customData: {
//                 test: "test"
//             },
//             roles: []
//         };
//         db.createUser(user);
//         res.send('Data has been sent to collection');
//     })