import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../src/pages/login/login';
import { AuthContext } from '../src/authContext/AuthContext';
import { vi } from 'vitest';

// Mock login function to avoid actual API calls during testing
vi.mock('../src/authContext/apiCalls', () => ({
    login: vi.fn(),
}));

describe('Login Component', () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        render(
            <AuthContext.Provider value={{ dispatch: mockDispatch }}>
                <Login />
            </AuthContext.Provider>
        );
    });

    test('renders login form correctly', () => {
        // Check if form fields are rendered
        expect(screen.getByPlaceholderText('Email of phone number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('renders the "New to Netflix? Sign up now." text', () => {
        expect(
            screen.getByText((content, element) =>
                element.textContent === 'New to Netflix? Sign up now.'
            )
        ).toBeInTheDocument();
    });

    test('handles email and password input changes', () => {
        // Simulate user typing email and password
        fireEvent.change(screen.getByPlaceholderText('Email of phone number'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });

        // Check if values are updated correctly
        expect(screen.getByPlaceholderText('Email of phone number').value).toBe('test@example.com');
        expect(screen.getByPlaceholderText('Password').value).toBe('password123');
    });

    test('calls login function when form is submitted', () => {
        // Simulate user typing email and password
        fireEvent.change(screen.getByPlaceholderText('Email of phone number'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });

        // Simulate form submission via button click
        const button = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(button);  // Simulating button click

        // Check if login function is called with correct arguments
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'LOGIN',
            payload: { email: 'test@example.com', password: 'password123' },
        });
    });
});
