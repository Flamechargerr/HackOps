
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from '../PasswordInput';
import '@testing-library/jest-dom';

describe('PasswordInput', () => {
  test('renders input field correctly', () => {
    const mockSetPassword = jest.fn();
    render(<PasswordInput password="" setPassword={mockSetPassword} isGameComplete={false} />);
    
    const inputField = screen.getByPlaceholderText(/type your password/i);
    expect(inputField).toBeInTheDocument();
    expect(inputField).not.toBeDisabled();
  });
  
  test('calls setPassword when input changes', () => {
    const mockSetPassword = jest.fn();
    render(<PasswordInput password="" setPassword={mockSetPassword} isGameComplete={false} />);
    
    const inputField = screen.getByPlaceholderText(/type your password/i);
    fireEvent.change(inputField, { target: { value: 'testpassword' } });
    
    expect(mockSetPassword).toHaveBeenCalledWith('testpassword');
  });
  
  test('disables input when game is complete', () => {
    const mockSetPassword = jest.fn();
    render(<PasswordInput password="test" setPassword={mockSetPassword} isGameComplete={true} />);
    
    const inputField = screen.getByPlaceholderText(/type your password/i);
    expect(inputField).toBeDisabled();
  });
  
  test('shows entered password in the input field', () => {
    const mockSetPassword = jest.fn();
    render(<PasswordInput password="securepassword" setPassword={mockSetPassword} isGameComplete={false} />);
    
    const inputField = screen.getByPlaceholderText(/type your password/i);
    expect(inputField).toHaveValue('securepassword');
  });
});
