import express, {Request, Response, RequestHandler} from 'express';
import sequelize from './db';
import Todo from './models/Todo';

const app = express();

const port = 5001;

// general structure for route definition: app.METHOD(PATH, HANDLER)

app.get('/', (req: Request, res: Response) => {
    try {
        const todos = await Todo.findAll();
        res.status(200).json(todos);
    } catch(error) {
        console.log('Error fetching todos', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

app.post

app.put('/id', (req: Request, res: Response),  => {
    try {
        const updateTodo = await todo_app.set        
    } catch(error) {

    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});