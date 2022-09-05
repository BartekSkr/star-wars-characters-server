const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(
  '/graphql3220',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.use(express.static('public'));

app.get('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(`Server is running on port localhost:${PORT}/graphql`)
);
