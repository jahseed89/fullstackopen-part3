const express = require('express')
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
    }
]



app.get('/', (request, response) => {
  response.send('<h1>Welcome to baackend!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.end(JSON.stringify(persons))
})

app.get('/info', (request, response) => {
    const title = 'Phonebook has info of 2 people';
    const information = 'Sat Jan 22 2022 22:27 GMT+0200 (Eastem Erupean Starderd Time)';
  
    response.send(`
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body>
          <h1>${title}</h1>
          <p>${information}</p>
        </body>
      </html>
    `);
  });


const PORT = 3006
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})