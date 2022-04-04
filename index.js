require('dotenv').config();
const express = require('express');
const userdata = require('./userdata.json');

const port = process.env.PORT;
const app = express();

app.get('/api/persons', (req, res) => {
    console.log(userdata);
    res.status(200).send(userdata);
})

app.get('/api/persons/:id', (req, res) => {
    const person = userdata.find(({id}) => id == req.params.id);
    console.log(person);
    if (!person) {
        return res.status(404).send(`person with id ${req.params.id} not found`);
    }
    res.status(200).send(person);
})

app.get('/info', (req, res) => {
    const date = new Date();
    const response = `Phonebook has info for ${userdata.length} people<br><br>${date}`;
    res.status(200).send(response);
})

app.listen(port, () => {
    console.log(`Starting server on port: ${port}`);
});