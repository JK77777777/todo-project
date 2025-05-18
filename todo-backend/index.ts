import express, {Request, Response, RequestHandler} from 'express';
import cors from 'cors';
import sequelize from './db';
import Todo from './models/Todo';

// Define port on which the server will listen
const port = 5001;

// Set up express server, which handles routes and HTTP requests
const app = express();

// Configure express to transform requests/responses to JSON
// Makes payloads available in req.body()
app.use(express.json());

// Enable cross-origin resource sharing
app.use(cors({ origin: 'http://localhost:3000' }));

// Sync database
async function syncDatabase() {
    try {
        await sequelize.sync();
        console.log('Database synced');
    } catch (error) {
        console.error('Error syncing database', error);
        process.exit(1); // Aborts running this app, 1 meaning uncaught fatal exception
    }
};

syncDatabase();

// Define routes
// General structure for route definition: app.METHOD(PATH, HANDLER)

app.get('/todos', async (req: Request, res: Response) => {
    try {
        const todos = await Todo.findAll();
        res.status(200); // Set 200 OK status code
        res.json(todos); // Convert the todos object to JSON & send status code
    } catch(error) {
        console.error('Error fetching todos', error);
        // 500 Internal Server Error - The server failed to fulfill a valid request due to an unexpected condition.
        res.status(500);
        res.json({ error: 'Failed to fetch todos' });
    }
});

app.post('/todos', async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        if (text === undefined || typeof text !== 'string' || text.trim() === '') {
            res.status(400); // Bad Request
            res.json({ error: 'Text must be a non-empty string'});
            return;
        };
        const newTodo = await Todo.create({ text });
        res.status(201); // Set 201 CREATED status code
        res.json(newTodo); // Convert the newTodo object to JSON & send status code
    } catch(error) {
        console.error('Error creating todo', error);
        res.status(500);
        res.json({ error: 'Failed to create todo' });
    }
});

app.put('/todos/:id', async (req: Request, res: Response)  => {
    try {
        // Destructuring
        // https://www.youtube.com/watch?v=NIq3qLaHCIs
        const { id } = req.params;
        const { text, isDone } = req.body;

        // Validate that id is a positive integer
        // Weird symbols are regular expression (ChatGPT 'reg exp syntax')
        if (!/^\d+$/.test(String(id))) { 
            res.status(400);
            res.json({ error: 'Invalid ID format'});
            return;
        };

        // Finding todo
        // https://sequelize.org/docs/v7/querying/select-methods/
        const updateTodo = await Todo.findByPk(id);
        if (!updateTodo) {
            res.status(404); // Not Found
            res.json({error: 'Todo not found'});
            return;
        };

        // Updating todo
        // https://sequelize.org/docs/v7/querying/update/
        if (text !== undefined && typeof text === 'string' && text.trim() !== '') {
            updateTodo.text = text;
        };
        if (isDone !== undefined && typeof isDone === 'boolean') {
            updateTodo.isDone = isDone;
        };
        await updateTodo.save();
        res.status(200);
        res.json(updateTodo);

    } catch(error) {
        console.error('Error updating todo', error); // console log
        res.status(500); // Internal Server Error, sent to client
        res.json({ error: 'Failed to update todo' }); // is sent to client
    }
});

app.delete('/todos/:id', async (req: Request, res: Response) => {
    try {
        // Destructuring
        const { id } = req.params;

        // Validate that id is a positive integer
        // Weird symbols are regular expression (ChatGPT 'reg exp syntax')
        if (!/^\d+$/.test(String(id))) { 
            res.status(400);
            res.json({ error: 'Invalid ID format'});
            return;
        };

        // Find todo
        const deleteTodo = await Todo.findByPk(id);
        if (!deleteTodo) {
            res.status(404);
            res.json({error: 'Todo not found'});
            return;
        };

        // Delete todo
        await deleteTodo.destroy();
        res.status(204); // No Content
        res.send(`Successfully deleted todo with id ${id}'`);
    } catch (error) {
        console.error('Error deleting todo', error);
        res.status(500); // Internal Server Error
        res.json({ error: 'Failed deleting todo'});
    }
});

// Make server receive requests
app.listen(port, () => {
    console.log(`Server running on port http/localhost:${port}`)
});