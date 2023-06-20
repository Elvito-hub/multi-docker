const keys = require('./keys');

//EXpress setup

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//postgres setup

const {Pool} =require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host:keys.pgHost,
    database:keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error',()=>console.log('lOST PG CONNECTION'))

pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
  });

//REDIS CLIENT SETUP

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

//route handlers

app.get('/',(req,res)=>{
    res.send('hi');
})

app.get('/values/all',async(req,res)=>{
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
})

app.get('/values/current',async(req,res)=>{
    redisClient.hgetall('values',(err,values)=>{
        res.send(values);
    })
})

app.post('/values',async(req,res)=>{
    const index = req.body.index;

    if(parseInt(index)>40){
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values',index,'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO VALUES(number) VALUES($1)',[index]);

    res.send({working: true});
})

app.listen(5001,err=>{
    console.log('Listening on 5001')
})