const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const app = express()
const cors = require('cors')
const Phonebook = require('./models/Phone')

app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(res.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Phonebook.find({}).then(nums => {
    res.json(nums)
  })
})

app.get('/health', (req, res) => {
  throw 'error...'
  // eslint-disable-next-line no-unreachable
  res.send('ok')
})

app.get('/info', (req, res) => {
  Phonebook.find({}).then(result => {
    res.send(`<p>Phonebook has info for ${result.length} people.</p><p>${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then(per => {
      if (per) {
        response.json(per)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })

})

app.put('/api/persons/:id', async (req, res) => {
  try {
    const person = await Phonebook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(person);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error when updating');
  }
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  morgan.token('body', req => JSON.stringify(req.body))
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    });
  }

  Phonebook.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        Phonebook.findByIdAndUpdate(
          existingPerson._id,
          { number: body.number },
          { new: true }
        )
          .then((updatedPerson) => {
            response.json(updatedPerson);
          })
          .catch((error) => next(error));
      } else {
        const person = new Phonebook({
          name: body.name,
          number: body.number,
        });

        person
          .save()
          .then((savedPerson) => {
            response.json(savedPerson);
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));

});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server is running')
})
