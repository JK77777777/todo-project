import React from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

const App: React.FC = () => {
    return (
        <div style={{ padding: '1rem' }}>
            <h1>Todo List</h1>
            <TodoList />
            <AddTodo />
        </div>
    );
};

export default App;