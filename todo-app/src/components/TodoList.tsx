import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { Todo, TodoItemProps } from '../types';
import { backendPort } from '../types';

const TodoList: React.FC = () => {
    // Define state to hold todos
    const [todos, setTodos] = useState<Todo[]>([]);
    
    useEffect(() => {
        fetch(`http://localhost:${backendPort}/todos`)
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch(console.error);
    }, []);

    const removeTodo = (id: number) => {
        setTodos((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div>
            {todos.map((todo) => (
                <TodoItem 
                    key={todo.id}
                    todo={todo}
                    backendPort={backendPort}
                    onDelete={removeTodo}
                />
            ))}
        </div>
    );
};

export default TodoList;