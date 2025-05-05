import axios from 'axios';

const baseUrl = '/api/tickets';

// GET all tickets
const getAll = () => {
    return axios.get(baseUrl).then(response => response.data);
};

// POST a new ticket
const create = (ticketObject) => {
    return axios.post(baseUrl, ticketObject).then(response => response.data);
};

// PUT to update a ticket
const update = (id, updatedTicket) => {
    return axios.put(`${baseUrl}/${id}`, updatedTicket).then(response => response.data);
};

// DELETE a ticket
const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
};

export default {
    getAll,
    create,
    update,
    remove
}