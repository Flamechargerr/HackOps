import { render } from '@testing-library/react';
import PasswordInput from '../PasswordInput';
import '@testing-library/jest-dom';

describe('PasswordInput', () => {
  test('renders input field correctly', () => {
    const mockSetPassword = jest.fn();
    const { container } = render(<PasswordInput password="" setPassword={mockSetPassword} isGameComplete={false} />);
    
    const inputField = container.querySelector('input');
    expect(inputField).toBeInTheDocument();
  });
  
  test('shows entered password in the input field', () => {
    const mockSetPassword = jest.fn();
    const { container } = render(<PasswordInput password="securepassword" setPassword={mockSetPassword} isGameComplete={false} />);
    
    const inputField = container.querySelector('input');
    expect(inputField).toHaveValue('securepassword');
  });
});