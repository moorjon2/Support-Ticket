require('dotenv').config();
const express = require('express');
const Ticket = require('./models/ticket')

const app = express()

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
    });


// Middleware
app.use(express.json())

// Routes
app.get('/api/health', (request, response) => {
    response.send({ status: 'ok' });
})

// GET all tickets
app.get('/api/tickets', (request, response, next) => {
    Ticket.find({})
        .then((tickets) => {
            response.json(tickets);
        })
        .catch((error) => next(error));
});

// GET a single ticket by ID
app.get('/api/tickets/:id', (request, response, next) => {
    const id = request.params.id;

    Ticket.findById(id)
        .then(ticket => {
            if (ticket) {
                response.json(ticket);
            } else {
                response.status(404).json({ error: 'ticket not found' });
            }
        })
        .catch(error => next(error)); // catch malformed IDs, etc.
});


// POST a new ticket
app.post('/api/tickets', (request, response, next) => {
    const { title, description } = request.body;

    if (!title || !description) {
        return response.status(400).json({ error: 'title or description missing' });
    }

    const newTicket = new Ticket({
        title,
        description,
    });

    newTicket.save()
        .then(savedTicket => {
            response.status(201).json(savedTicket);
        })
        .catch(error => next(error));
});

// DELETE ticket
app.delete('/api/tickets/:id', (request, response, next) => {
    const id = request.params.id;

    Ticket.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end(); // 204 No Content if successfully deleted
        })
        .catch(error => next(error)); // pass any DB errors to the error handler
});

// PUT update or replace ticket
app.put('/api/tickets/:id', (request, response, next) => {
    const { title, description, status } = request.body;
    const ticketId = request.params.id;

    const updatedTicket = {
        title,
        description,
        status,
    };

    Ticket.findByIdAndUpdate(ticketId, updatedTicket, {
        new: true, // return the updated document
        runValidators: true, // make sure validation still runs
        context: 'query', // required for some validation cases
    })
        .then(updated => {
            if (updated) {
                response.json(updated);
            } else {
                response.status(404).json({ error: 'ticket not found' });
            }
        })
        .catch(error => next(error));
});

// GET /api/info - show ticket count and date
app.get('/api/info', (request, response, next) => {
    Ticket.countDocuments({})
        .then(count => {
            const timeStamp = new Date();
            response.send(`
                <p>Support system has ${count} tickets</p>
                <p>${timeStamp}</p>
            `);
        })
        .catch(error => next(error));
});

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})