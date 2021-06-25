import { render, screen } from '@testing-library/react';
import Hello from '../components/Hello';

describe('Hello', () => {
  it('renders', () => {
    render(<Hello />);

    expect(screen.getByText(/hello$/i)).toBeInTheDocument();
  });
});
