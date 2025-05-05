import { useEffect, useState } from 'react';
import ticketService from './services/ticketService';

const App = () => {
    const [tickets, setTickets] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('')

    // Fetch tickets from backend
    useEffect(() => {
        ticketService
            .getAll()
            .then(initialTickets => {
                console.log('Fetched data:', initialTickets);
                setTickets(initialTickets);
            })
            .catch(error => {
                console.error('Error fetching tickets:', error);
            });
    }, []);

    // Submit handler
    const handleCreateTicket = (event) => {
        event.preventDefault();

        const newTicket = {
            title: newTitle,
            description: newDescription,
        };

        ticketService
            .create(newTicket)
            .then((createdTicket) => {
                setTickets(tickets.concat(createdTicket));
                setNewTitle('');
                setNewDescription('');
            })
            .catch((error) => {
                console.error('Error creating ticket:', error);
            });
    };

    // Delete ticket handler
    const handleDeleteTicket = (id) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            ticketService
                .remove(id)
                .then(() => {
                    setTickets(tickets.filter((ticket) => ticket.id !== id));
                })
                .catch((error) => {
                    console.error('Error deleting ticket:', error)
                });
        }
    };

    const startEditing = (ticket) => {
        setEditingId(ticket.id);
        setEditedTitle(ticket.title);
        setEditedDescription(ticket.description);
    }

    const cancelEditing = () => {
        setEditingId(null);
        setEditedTitle('');
        setEditedDescription('');
    }

    // Update ticket handler
    const handleUpdateTicket = (event) => {
        event.preventDefault();

        const updatedTicket = {
            title: editedTitle,
            description: editedDescription
        };

        ticketService.update(editingId, updatedTicket)
            .then((updated) => {
                setTickets(tickets.map(ticket => ticket.id === editingId ? updated : ticket));
                cancelEditing()
            })
            .catch(error => console.error('Error updating ticket:', error));
    };

    return (
        <div>
            <h1>Support Ticket System</h1>

            <h2>Create New Ticket</h2>
            <form onSubmit={handleCreateTicket}>
                <input
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                />
                <br />
                <textarea
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Create Ticket</button>
            </form>

            <h2>All Tickets</h2>
            {tickets.length === 0 ? (
                <p>No tickets yet.</p>
            ) : (
                <ul>
                    {tickets.map(ticket => (
                        <li key={ticket.id}>
                            {editingId === ticket.id ? (
                                <form onSubmit={handleUpdateTicket}>
                                    <input
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        required
                                    />
                                    <br />
                                    <textarea
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        required
                                    />
                                    <br />
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={cancelEditing}>Cancel</button>
                                </form>
                            ) : (
                                <>
                                    <strong>{ticket.title}</strong>: {ticket.description}
                                    <br />
                                    <button onClick={() => startEditing(ticket)}>Edit</button>
                                    <button onClick={() => handleDeleteTicket(ticket.id)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;
