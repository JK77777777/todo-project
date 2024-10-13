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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Define the GET /todos route
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.findAll();
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Define the POST /todos route
app.post('/todos', async (req, res) => {
    const { text, isDone } = req.body;
    try {
        const newTodo = await Todo.create({ text, isDone });
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(400).json({ error: 'Bad request' });
    }
});

// Export the app for testing
export default app; // Add this line to export your app