import express from 'express';
import cors from 'cors';
import sequelize from './db';
import Todo from './models/Todo';

const app = express();
const PORT = 5001; // Change this if needed

app.use(cors());
app.use(express.json()); // For parsing application/json

// Check database connection
sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Sync models
sequelize.sync({ force: true })
    .then(() => console.log('Database & tables created!'))
    .catch((error) => console.error('Error creating database:', error));

// Define the POST /todos route
app.post('/todos', async (req, res) => {
    const { text } = req.body;
    try {
        const newTodo = await Todo.create({ text });
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todos:', error);
        res.status(500).json({ error: 'Failed to create new todo'});
    }
});

// Define the GET /todos route
app.get('/todos', async (req, res) => {
    const { text } = req.body;
    try {
        const todos = await Todo.findAll();
        res.status(200).json(todos);
    } catch (error) {
        console.error('Error fetching todos', error);
        res.status(500).json({ error: 'Failed to retrieve todos'});
    }
});

// Define the PUT /todos route
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { text, isDone } = req.body;
    try {
        const todo = await Todo.findByPk(id);
        if (!todo) return res.status(404).json({ error: 'Todo not found' });

        todo.text = text !== undefined ? text : todo.text;
        todo.isDone = isDone !== undefined ? isDone : todo.isDone;
        await todo.save();

        res.status(200).json(todo);
    } catch (error) {
        console.error('Error editing todo', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// Define the DELETE /todos route
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const todo = await Todo.findByPk(id);
        if (!todo) return res.status(404).json({ error: 'Todo not found' });

        await todo.destroy();

        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting todo', error);
        res.status(500).json({ error: 'Failed to delete todo'})
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing
export default app; // Add this line to export your app