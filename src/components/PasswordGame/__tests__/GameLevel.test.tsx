import { render } from '@testing-library/react';
import GameLevel from '../GameLevel';
import '@testing-library/jest-dom';

describe('GameLevel', () => {
  test('renders level and score correctly', () => {
    const { container } = render(<GameLevel level={3} score={300} />);
    
    expect(container.textContent).toContain('3');
    expect(container.textContent).toContain('300');
    expect(container.textContent).toContain('Security Level');
    expect(container.textContent).toContain('Points');
  });
  
  test('shows progress indicator', () => {
    const { container } = render(<GameLevel level={4} score={400} />);
    
    const progressBar = container.querySelector('.bg-gradient-to-r');
    expect(progressBar).toBeInTheDocument();
  });
});