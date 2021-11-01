const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config()
const app=express();
const port= process.env.PORT||5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sm9ey.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
await client.connect();
const database = client.db("travel");
    const service = database.collection("service");
    const surviver = database.collection("surviver");

app.get('/challenges', async(req, res)=>{
    const cursor=service.find({});
    const challenges= await cursor.toArray();
    res.send(challenges);
})

app.get('/challenges/:id', async (req, res) => {
    const id = req.params.id;
    
    const query = { _id: ObjectId(id) };
    const challenge = await service.findOne(query);
    res.json(challenge);
})


    app.post('/challenges', async(req, res)=>{
        const challenges=req.body;
        console.log("hitted " , challenges)

        const result= await service.insertOne(challenges);
        res.json(result);

    })
    app.get('/surviver', async(req, res)=>{
        const cursor=surviver.find({});
        const clients=await cursor.toArray();
        res.send(clients);
    })

    app.post('/surviver', async(req, res)=>{
        const client=req.body;
        const result= await surviver.insertOne(client)
        res.json(result)
    })

    app.delete('/surviver/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await surviver.deleteOne(query);

        console.log('deleting user with id ', result);

        res.json(result);
    })
    }
finally{
    //await client.close()
}
}

run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('running crouso travel')
});



app.listen(port, ()=>{
    console.log('running on port', port);
})