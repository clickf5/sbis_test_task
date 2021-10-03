import routes from './routes.js';
const apiKey = '7edd97fa2e9afe9aa480564a3686d5d8';

export default {
  getQuotes: async () => {
    const response = await fetch(routes.quotes(), {
      headers: {
        Authorization: `Token token=${apiKey}`,
      },
    });
    const { quotes } = await response.json();
    return quotes;
  },
};
