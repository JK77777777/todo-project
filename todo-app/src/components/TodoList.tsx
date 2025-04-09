// this code will not be used anymore once App.tsx is updated to contain all frontend code

import React from 'react';
import TodoItem from './TodoItem';
import { Todo, TodoItemProps } from '../types';
import { backendPort } from '../types';

interface TodoListProps {
    todos: Todo[];
    updateTodos: (newTodos: Todo[] | ((prev: Todo[]) => Todo[])) => void;
}

interface ExtendedTodoItemProps extends TodoItemProps {
    updateTodos: (newTodos: Todo[] | ((prev: Todo[]) => Todo[])) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, updateTodos }) => {
    const removeTodo = (id: number) => {
        updateTodos((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div>
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    backendPort={backendPort}
                    onDelete={removeTodo}
                    updateTodos={updateTodos}
                />
            ))}
        </div>
    );
};

export default TodoList;