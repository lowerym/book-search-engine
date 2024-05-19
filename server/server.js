require('dotenv').config();
// Implement Apollo Server and apply it to Express server as middleware
const express = require('express');
const path = require('path');
// Import Apollo Server
const { ApolloServer } = require('apollo-server-express');
// Middleware function for authentication
const { authMiddleware } = require('./utils/auth');
// Import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
// Create new Apollo Server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Context will be used for token authentication
  context: authMiddleware,
});

// Integrate Apollo Server with Express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
