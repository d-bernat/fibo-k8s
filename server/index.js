
const express = require('express');
const redis = require('redis');
const keys = require('./keys');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool }  = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('connect', () => {
    pgClient
        .query('create table if not exists values(number INT)')
        .catch((err) => console.log(err));
});

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app
    .get('/', (req, res) => {
        res.send(':-)');
    })
    .get('/values/all', async (req, res) => {
        const values = await pgClient.query('select *  from values');
        res.send(values.rows);
    })
    .get('/values/current', async (req, res) => {
        redisClient.hgetall('values', (err, values) => {
            res.send(values);
        })
    })
    .post('/values', async (req, res) => {
        const index = req.body.index;
        if(parseInt(index) > 40){
            return res.status(422).send('Index too high');
        }

        redisClient.hset('values', index, 'Nothing yet!');
        redisPublisher.publish('insert', index);
        pgClient.query('insert into values(number) VALUES($1)', [index]);

        res.send({working: true});
    });

app.listen("5000", () => 'listening on port 8888');

