const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");

dotenv.config();

const Person = require("./models/mongoose");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("build"));

app.get("/", (request, response) => {
  response.send("<h1>Welcome to baackend Project!</h1>");
});

app.get("/api/persons", (req, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
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

app.get("/api/persons/:id", (request, response) => {
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
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
});

// ******* Implementing post request **********
app.post("/api/persons", (request, response) => {
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
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
});

// ******* Updating persons Infomation ***********
app.put("/api/persons/:id", (request, response) => {
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
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
});

// *******Deleting request *******
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      response.status(500).json({ error: "Internal server error" });
    });
});

// app.use(morgan('combined'))

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
