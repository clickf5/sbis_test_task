const host = 'https://favqs.com';
const prefix = 'api';

export default {
  quotes: () => [host, prefix, 'quotes'].join('/'),
};
