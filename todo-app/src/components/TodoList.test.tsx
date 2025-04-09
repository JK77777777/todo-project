// this code will not be used anymore once App.tsx is updated to contain all frontend code

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { http } from 'msw';
import { server } from '../mocks/server';

// Test Suite
describe('App Component', () => {
    // Test 1: GET - Fetches and renders todos on mount
    test('fetches and renders todos on mount', async () => {
        render(<App />);
        // Wait for the initial fetch to complete and find the todo
        const todoElement = await screen.findByText('Test Todo 1');
        expect(todoElement).toBeInTheDocument();
    });

    // Test 2: POST - Adds a new todo
    test('adds a new todo', async () => {
        render(<App />);
        // Find the input and button
        const input = screen.getByPlaceholderText('New task');
        const addButton = screen.getByText('Add Todo');

        // Simulate adding a todo
        fireEvent.change(input, { target: { value: 'New Todo' } });
        fireEvent.click(addButton);

        // Wait for the new todo to appear
        const newTodo = await screen.findByText('New Todo');
        expect(newTodo).toBeInTheDocument();
    });

    // Test 3: PUT - Toggles a todo's done status
    test('toggles a todo as done', async () => {
        render(<App />);
        // Wait for the initial todo to load
        const todoText = await screen.findByText('Test Todo 1');
        expect(todoText).toBeInTheDocument();

        // Find the checkbox and toggle it
        const checkbox = screen.getByLabelText('Done');
        fireEvent.click(checkbox);

        // Verify the todo is marked as done (strikethrough style)
        expect(todoText).toHaveStyle('text-decoration: line-through');
    });

    // Test 4: DELETE - Deletes a todo
    test('deletes a todo', async () => {
        render(<App />);
        // Wait for the initial todo to load
        const todoText = await screen.findByText('Test Todo 1');
        expect(todoText).toBeInTheDocument();

        // Find the delete button and click it
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        // Verify the todo is removed
        expect(screen.queryByText('Test Todo 1')).not.toBeInTheDocument();
    });

    // Test 5: Handles GET failure
    test('handles fetch todos failure', async () => {
        // Override the GET handler to simulate a failure
        server.use(
            http.get('http://localhost:3000/todos', () => {
                return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
            })
        );

        render(<App />);
        // Since todos fail to load, the list should remain empty
        expect(screen.queryByText('Test Todo 1')).not.toBeInTheDocument();
    });
});