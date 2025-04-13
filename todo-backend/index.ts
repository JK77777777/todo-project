import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import sequelize from './db';
import Todo from './models/Todo';

const app = express();
const router = express.Router();
const PORT = 5001;

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use('/todos', router);

// Check Database Connection - need to understand deeper, maybe rewrite with try-catch
sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

sequelize.sync({ force: true }) 
    .then(() => console.log('Database & tables synced'))
    .catch(error => console.error('Error syncing database:', error));

// GET /todos - Retrieve All Todos
const getTodosHandler: RequestHandler = async (req, res): Promise<void> => {
    try {
        const todos = await Todo.findAll();
        res.status(200).json(todos);
    } catch (error) {
        console.error('Error retrieving todos:', error);
        res.status(500).json({ error: 'Failed to retrieve todos' });
    }
};

// POST /todos - Create a New Todo
const createTodoHandler: RequestHandler<{}, {}, { text: string }> = async (req, res): Promise<void> => {
    const { text } = req.body;

    try {
        const newTodo = await Todo.create({ text });
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Failed to create new todo' });
    }
};

// PUT /todos/:id - Edit a Todo
const updateTodoHandler: RequestHandler<{ id: string }, {}, { text?: string; isDone?: boolean }> = async (req, res): Promise<void> => {
    const { id } = req.params;
    const { text, isDone } = req.body;

    try {
        const todo = await Todo.findByPk(id);
        if (!todo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }

        if (text !== undefined) todo.text = text;
        if (isDone !== undefined) todo.isDone = isDone;

        await todo.save();
        res.status(200).json(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
};

// DELETE /todos/:id - Remove a Todo
const deleteTodoHandler: RequestHandler<{ id: string }> = async (req, res): Promise<void> => {
    const { id } = req.params;

    try {
        const todo = await Todo.findByPk(id);
        if (!todo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }

        await todo.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
};

// Register Routes
router.post('/', createTodoHandler);
router.get('/', getTodosHandler);
router.put('/:id', updateTodoHandler);
router.delete('/:id', deleteTodoHandler);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

export default app;