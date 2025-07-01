import { render, screen } from '@testing-library/react';
import App from '../../App';
export const apiUrl = process.env.REACT_APP_API_URL


test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
