require('dotenv').config();
const express = require('express');
const userdata = require('./userdata.json');

const port = process.env.PORT;
const app = express();
const ID_RANGE = 100000000;

app.get('/api/persons', (req, res) => {
    console.log(userdata);
    res.status(200).send(userdata);
})

app.post('/api/persons', (req, res) => {
    console.log(req.query)
    const name = req.query.name;
    const number = req.query.number;
    if (!name || !number) {
        return res.status(400).send(`required params name and number in request`);
    }
    if (userdata.find(obj => obj.name == name)) {
        return res.status(409).send(`name must be unique`);
    }
    userdata.push({name, number, id: Math.floor(Math.random() * ID_RANGE)})
    res.status(200).send(`added name ${name} in phonebook`);
})

app.get('/api/persons/:id', (req, res) => {
    const person = userdata.find(({id}) => id == req.params.id);
    console.log(person);
    if (!person) {
        return res.status(404).send(`person with id ${req.params.id} not found`);
    }
    res.status(200).send(person);
})

app.delete('/api/persons/:id', (req, res) => {
    const index = userdata.findIndex(({id}) => id == req.params.id);
    console.log(index);
    if (index == -1) {
        return res.status(404).send(`person with id ${req.params.id} not found`);
    }
    userdata.splice(index, 1);
    res.status(200).send(`deleted person id ${req.params.id}`);
})

app.get('/info', (req, res) => {
    const date = new Date();
    const response = `Phonebook has info for ${userdata.length} people<br><br>${date}`;
    res.status(200).send(response);
})

app.listen(port, () => {
    console.log(`Starting server on port: ${port}`);
});