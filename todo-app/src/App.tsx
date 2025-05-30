// Entire frontend in one file

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Beautiful UX is nice-to-have for now
// import './App.css'; 

interface Todo {
    id: number;
    text: string;
    isDone: boolean;
    createdAt: string;
}

const API_URL = 'http://localhost:5001/todos';

const App: React.FC = () => {
   const [ todos, setTodos ] = useState<Todo[]>([]);
    const [ newTodo, setNewTodo ] = useState<string>('');

    // Fetch all todos on mount

    useEffect(() => {
        fetchTodos();
    }, []);

    async function fetchTodos() {
        try {
            const response = await axios.get<Todo[]>(API_URL);
            setTodos(response.data); // Gets response data from backend
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    // Add a new todo
    async function addTodo () {
        const trimmedTodo = newTodo.trim();
        if (trimmedTodo === '') {
            return;
        }
        try {
            const response = await axios.post<Todo>(API_URL, { text: newTodo });
            const newTodoItem = response.data; // Gets response data from backend
            const updatedTodoList = todos.concat(newTodoItem);
            setTodos(updatedTodoList); 
            setNewTodo(''); // clears input field after adding a new todo
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    // Edit todo

    async function editTodo (id: number, updates: { text?: string, isDone?: boolean}) {
        try {
            const response = await axios.put<Todo>(`${API_URL}/${id}`, updates);
            
            const newTodos: Todo[] = [];
            for (const todo of todos) {
                if (todo.id === id) {
                    newTodos.push(response.data); // Set response data from backend
                } else {
                    newTodos.push(todo);
                }
            }

            setTodos(newTodos);
        } catch (error) {
            console.error('Error editing todo:', error);
        }
    }

    // Delete todo

    async function deleteTodo (id: number) {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            
            const newTodos: Todo[] = [];
            for (const todo of todos) {
                if (todo.id !== id) {
                    newTodos.push(todo)
                }
            }

            setTodos(newTodos);
        } catch (error) {
            console.log('Error deleting todo', error);
        }
    }

    return (
        <div>
            <h1>Todo List</h1>
            
            {/* Display todos */}
            <div>
                {todos.map((todo) => (
                    <div key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.isDone}
                            onChange={function() {editTodo(todo.id, { isDone: !todo.isDone })}} // defines anonymous function (because no name) which is only called when tick status changes
                        />
                        <span
                            style={{ 
                                textDecoration: todo.isDone ? 'line-through' : 'none' 
                            }}
                        >
                            {todo.text}
                        </span> 
                        <button 
                            onClick={function() {
                                const newText = prompt('Edit todo:', todo.text);
                                if (newText) {
                                    editTodo(todo.id, { text: newText });
                                }
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={function() {deleteTodo(todo.id)}}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {/* Add new todo section */}
            <div>
                <input 
                    type="text"
                    value={newTodo}
                    // 'event' is sent when onChange happens
                    onChange={function(event) {
                        console.log(event)
                        setNewTodo(event.target.value)
                    }}
                    placeholder="Add a new todo"
                />
                <button onClick={addTodo}>Add</button>
            </div>

        </div>
    );
};

export default App;

// Old code below

// import React, { useState, useEffect } from 'react';
// import TodoList from './components/TodoList';
// import AddTodo from './components/AddTodo';
// import { Todo, backendPort } from './types';

// const App: React.FC = () => {
//     const [todos, setTodos] = useState<Todo[]>([]);

//     // fetch todos on mount
//     useEffect(() => {
//         // define fetchTodos
//         const fetchTodos = async () => {
//             try {
//                 const response = await fetch(`http://localhost:${backendPort}/todos`);
//                 if (!response.ok) throw new Error('Failed to fetch todos');
//                 const data = await response.json();
//                 setTodos(data);
//             } catch (error) {
//                 console.error('Fetch todos failed:', error);
//             }
//         };
//         // execute fetchTodos
//         fetchTodos();
//     }, []); // function only runs only on mount because no dependencies defined

//     // update todos every time Todo array changes
//     // newTodos is of type Todo[] or it is 
//     // '(prev: Todo[]) => Todo[])' is a function that receives the current Todo list ('prev') and produces an updated Todo list
//     const updateTodos = (newTodos: Todo[] | ((prev: Todo[]) => Todo[])) => {
//         setTodos(newTodos);
//     };

//     return (
//         <div style={{ padding: '1rem' }}>
//             <h1>Todo List</h1>
//             <TodoList todos={todos} updateTodos={updateTodos} />
//             <AddTodo updateTodos={updateTodos} />
//         </div>
//     );
// };

// export default App;