import { render } from '@testing-library/react';
import PasswordGame from '../index';
import '@testing-library/jest-dom';

describe('PasswordGame', () => {
  test('renders the initial state correctly', () => {
    const { container } = render(<PasswordGame />);
    
    expect(container.textContent).toContain('Security Level');
    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('0');
  });
  
  test('renders password input', () => {
    const { container } = render(<PasswordGame />);
    
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();
  });
});