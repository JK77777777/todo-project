import express, {Request, Response, RequestHandler} from 'express';
import sequelize from './db';
import Todo from './models/Todo';

const app = express();

const port = 5001;

// general structure for route definition: app.METHOD(PATH, HANDLER)

app.get('/', async (req: Request, res: Response) => {
    try {
        const todos = await Todo.findAll();
        res.status(200); // Sending 200 OK status code
        res.json(todos); // Convert the todos object to JSON
    } catch(error) {
        console.log('Error fetching todos', error);
        // 500 Internal Server Error - The server failed to fulfill a valid request due to an unexpected condition.
        res.status(500);
        res.json({ error: 'Failed to fetch todos' });
    }
});

app.post('/', async (req: Request, res: Response) => {
    try {
        const newTodo = await Todo.create();
        res.status(201); // Sends 201 CREATED status code
        res.json(newTodo); // Converts the newTodo object to JSON
    } catch(error) {
        console.log('Error creating todo', error);
        res.status(500);
        res.json({ error: 'Failed to create todo' });
    }
})

app.put('/:id', async (req: Request, res: Response)  => {
    try {
        // Destructuring
        // https://www.youtube.com/watch?v=NIq3qLaHCIs
        const { id } = req.params;
        const { text, isDone } = req.body;

        // Finding todo
        // https://sequelize.org/docs/v7/querying/select-methods/
        const updateTodo = await Todo.findByPk(id);
        if (!updateTodo) {
            res.status(404);
            res.json({error: 'Todo not found'});
            return;
        }

        // Updating todo
        // https://sequelize.org/docs/v7/querying/update/
        if (text !== undefined) { updateTodo.text = text };
        if (isDone !== undefined) { updateTodo.isDone = isDone };
        await updateTodo.save();
        res.status(200);
        res.json(updateTodo);

        // Test – to be deleted: Learning what's inside req.params and req.body (see docs: https://expressjs.com/en/4x/api.html#req.body)
        console.log(req.params)
        console.log(req.body);

    } catch(error) {
        console.log('Error updating todo', error); // console log
        res.status(500); // is sent to client
        res.json({ error: 'Failed to update todo' }) // is sent to client
    }
})

// Define app.delete()

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});