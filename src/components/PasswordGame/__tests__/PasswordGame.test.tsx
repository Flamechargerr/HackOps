
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordGame from '../index';
import '@testing-library/jest-dom';

describe('PasswordGame', () => {
  test('renders the initial state correctly', () => {
    render(<PasswordGame />);
    
    // Check initial UI elements
    expect(screen.getByText(/security level/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Initial score
    expect(screen.getByPlaceholderText(/type your password/i)).toBeInTheDocument();
    
    // Initial requirements - only length requirement should be visible
    expect(screen.getByText(/password must be at least 5 characters long/i)).toBeInTheDocument();
    expect(screen.queryByText(/password must contain at least one uppercase letter/i)).not.toBeInTheDocument();
  });
  
  test('completes level 1 when password meets length requirement', () => {
    render(<PasswordGame />);
    
    const passwordInput = screen.getByPlaceholderText(/type your password/i);
    fireEvent.change(passwordInput, { target: { value: 'password12345' } });
    
    // After entering valid password, score should update and level should increase
    expect(screen.getByText('100')).toBeInTheDocument(); // Updated score
    
    // Level 2 requirement should appear
    expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
  });
  
  test('tracks multiple requirements completion correctly', () => {
    render(<PasswordGame />);
    
    const passwordInput = screen.getByPlaceholderText(/type your password/i);
    
    // Enter password that meets level 1 & 2 requirements
    fireEvent.change(passwordInput, { target: { value: 'Password12345' } });
    
    // Score should be 200 (100 per requirement)
    expect(screen.getByText('200')).toBeInTheDocument();
    
    // Level 3 requirement should appear
    expect(screen.getByText(/password must contain at least one number/i)).toBeInTheDocument();
  });
  
  test('handles invalid password correctly', () => {
    render(<PasswordGame />);
    
    const passwordInput = screen.getByPlaceholderText(/type your password/i);
    
    // Enter invalid password (too short)
    fireEvent.change(passwordInput, { target: { value: 'pwd' } });
    
    // Score should still be 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });
  
  test('completes game with all requirements met', async () => {
    render(<PasswordGame />);
    
    const passwordInput = screen.getByPlaceholderText(/type your password/i);
    
    // Enter password that meets all requirements for levels 1-8
    fireEvent.change(passwordInput, { 
      target: { 
        value: 'PaSsWoRd123!@#JanuaryXYZ' 
      } 
    });
    
    // Game completion message should appear
    expect(await screen.findByText(/congratulations/i)).toBeInTheDocument();
    expect(screen.getByText(/play again/i)).toBeInTheDocument();
  });
  
  test('reset button works correctly', async () => {
    render(<PasswordGame />);
    
    // Complete the game first
    const passwordInput = screen.getByPlaceholderText(/type your password/i);
    fireEvent.change(passwordInput, { 
      target: { value: 'PaSsWoRd123!@#JanuaryXYZ' } 
    });
    
    // Find and click the reset button
    const resetButton = await screen.findByText(/play again/i);
    fireEvent.click(resetButton);
    
    // Game should be reset to initial state
    expect(screen.queryByText(/congratulations/i)).not.toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Back to level 1
    expect(screen.getByText('0')).toBeInTheDocument(); // Score reset to 0
  });
});
