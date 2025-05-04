const errorHandler = (error, request, response, next) => {
    console.error('Error:', error.message)

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted ID' });
    }

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    return response.status(500).json({ error: 'internal server error' })
}

module.exports = errorHandler;