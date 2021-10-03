import './components/Grid.js';
import api from './utils/api.js';

export default async () => {
  const root = document.getElementById('root');
  const grid = document.createElement('custom-grid');
  grid.setState({ isLoading: true });
  root.appendChild(grid);

  const quotes = await api.getQuotes();
  
  const data = quotes.map((quote) => {
    const {
      id, author, body, tags,
    } = quote;
    return {
      id, author, quote: body, tags,
    };
  });
  grid.setState({ isLoading: false, data });
};
