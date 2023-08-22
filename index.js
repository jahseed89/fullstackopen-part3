const express = require("express");
require("dotenv").config()
const app = express();
const cors = require("cors");


const Person = require("./models/person");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const handleError = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("build"));

app.get("/", (request, response, next) => {
  response.send("<h1>Welcome to baackend Project!</h1>");
  next()
});

app.get("/api/persons", (req, response) => {
  Person.
  
  find({})
    .then((persons) => {
      response.json(persons);
    })
});

app.get("/info", (request, response) => {
  const title = "Phonebook has info of 2 people";
  const information =
    "Sat Jan 22 2022 22:27 GMT+0200 (Eastem Erupean Starderd Time)";

  response.send(`
      <html>
        <body>
          <h1>${title}</h1>
          <p>${information}</p>
        </body>
      </html>
    `);
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  // Find the person in the database by ID
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => next(error))
});

// ******* Implementing post request **********
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "Name must be provided" });
  }

  const person = new Person({
    name: body.name,
    number: body.number || "",
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error))
});

// ******* Updating persons Infomation ***********
app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  const updatedPerson = {
    number: body.number || "",
  };

  Person.findByIdAndUpdate(id, updatedPerson, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => next(error))
});

// *******Deleting request *******
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(handleError)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
