const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

const CONNECTION_STRING = 'mongodb+srv://madiyar:12344321Madiar@cluster0.qsfsl.mongodb.net/simplecrud_madiyar?retryWrites=true&w=majority';

app.set('view engine', 'ejs');

app.use(bodyParser.json())
app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function () {
    console.log('Server is running');
})


MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        app.get('/', function (req, res) {
            db.collection('quotes').find().toArray()
                .then(result => {
                    console.log(result)

                    res.render(__dirname + '/client/index.ejs', { quotes: result });
                })
                .catch(error => console.error(error))
        });

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(err => console.log(err));
        })

        app.put('/quotes', (req, res) => {
            console.log(req.body);

            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => { res.json('Success') })
                .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json(`Deleted Darth Vadar's quote`)
                })
                .catch(error => console.error(error))
        })


    })
    .catch(error => console.error(error));