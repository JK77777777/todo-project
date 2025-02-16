import React, { useState } from 'react';

const AddTodo: React.FC = () => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetch('http://localhost:<BACKEND_PORT>/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                isDone: false,
                createdAt: new Date().toISOString(),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Todo added:', data);
                setText(''); // reset the input field
            })
            .catch((error) => console.error('Error adding todo:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='New task'
            />
            <button type='submit'>Add Todo</button>
        </form>
    );
};

export default AddTodo;