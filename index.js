const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": 5,
        "name": "Junny Bravo", 
        "number": "13-33-3984900"
    },
    { 
        "id": 6,
        "name": "Samini Tempa", 
        "number": "77-01-474833"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Welcome to baackend Project!</h1>')
})

app.get('/api/persons', (request, response) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    response.end(JSON.stringify(persons))
})

app.get('/info', (request, response) => {
    const title = 'Phonebook has info of 2 people';
    const information = 'Sat Jan 22 2022 22:27 GMT+0200 (Eastem Erupean Starderd Time)';
  
    response.send(`
      <html>
        <body>
          <h1>${title}</h1>
          <p>${information}</p>
        </body>
      </html>
    `);
  });

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
        response.end(JSON.stringify(person))
    } else {
      response.status(404).end()
    }
  
  })

// *******Deleting request *******
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// ***** Generating an id for post request ***********
const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(num => num.id))
    : 0
    return maxId + 1
}

// ******* Implementing post request **********
app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name) {
        response.status(400).json({error: 'name must be unique'})
    }
    const person = {
        name: body.name,
        number: body.number || false,
        date: new Date(),
        id: generateId(),
      }
      persons = persons.concat(person)
      response.json(person)
      console.log(request, response)
})

app.use(morgan('combined'))

const PORT = 3006
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})