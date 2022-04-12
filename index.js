require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const bodyparser = require("body-parser")
const cors = require("cors")
const Person = require("./models/person")

const port = process.env.PORT || 3001
const app = express()

morgan.token("content", (req) => {
    const cont = JSON.stringify(req.body)
    if (cont) return cont
    else return "{}"
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === "CastError") {
        return res.status(400).json({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(express.static("build"))
app.use(cors())
app.use(bodyparser.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))

app.get("/api/persons", (req, res, next) => {
    Person.find({}).then(result => {
        console.log(result)
        const all_persons = result.map(p => p.toJSON())
        console.log(all_persons)
        res.status(200).send(all_persons)
    }).catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
    console.log(req.body)
    const name = req.body.name
    const number = req.body.number
    const new_person = new Person({ name, number })
    new_person.save().then(result => {
        res.status(200).json(result)
    }).catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id).then(result => {
        res.status(200).json(result.toJSON())
    }).catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
    const updated_person = {
        name: req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(
        req.params.id,
        updated_person,
        { new: true, runValidators: true, context: "query" }
    ).then(result => {
        res.status(200).json(result.toJSON())
    }).catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(() => {
        res.status(204).send()
    }).catch(error => next(error))
})

app.get("/info", (req, res, next) => {
    Person.count({}).then(result => {
        const date = new Date()
        const response = `Phonebook has info for ${result} people<br><br>${date}`
        res.status(200).send(response)
    }).catch(error => next(error))
})

app.listen(port, () => {
    console.log(`Starting server on port: ${port}`)
})

app.use(errorHandler)