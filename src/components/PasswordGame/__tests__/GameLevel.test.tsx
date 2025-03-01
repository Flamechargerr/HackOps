
import { render, screen, fireEvent } from '@testing-library/react';
import GameLevel from '../GameLevel';
import '@testing-library/jest-dom';

describe('GameLevel', () => {
  test('renders level and score correctly', () => {
    render(<GameLevel level={3} score={300} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText(/security level/i)).toBeInTheDocument();
    expect(screen.getByText(/points/i)).toBeInTheDocument();
  });
  
  test('shows Sparkles icon when level is greater than 1', () => {
    const { rerender } = render(<GameLevel level={1} score={100} />);
    
    // No sparkles at level 1
    expect(screen.queryByTestId('sparkles')).not.toBeInTheDocument();
    
    // Rerender with level 2
    rerender(<GameLevel level={2} score={200} />);
    
    // Sparkles should be visible now
    const sparkleSvg = document.querySelector('.text-yellow-400');
    expect(sparkleSvg).toBeInTheDocument();
  });
  
  test('progress bar width reflects current level progress', () => {
    render(<GameLevel level={4} score={400} />);
    
    const progressBar = document.querySelector('.bg-gradient-to-r');
    expect(progressBar).toHaveStyle('width: 50%'); // 4/8 = 50%
  });
  
  test('credit text is rendered', () => {
    render(<GameLevel level={1} score={100} />);
    
    expect(screen.getByText(/Made with love By Flamechargerr/i)).toBeInTheDocument();
  });
  
  test('hover effects are applied', () => {
    render(<GameLevel level={5} score={500} />);
    
    const card = document.querySelector('.rounded-xl');
    fireEvent.mouseEnter(card as Element);
    
    // Now the card should have a 3D rotation style
    expect(card).toHaveStyle('transform: rotateX(2deg) rotateY(2deg)');
    
    fireEvent.mouseLeave(card as Element);
    
    // Card should return to normal
    expect(card).toHaveStyle('transform: rotateX(0) rotateY(0)');
  });
});
