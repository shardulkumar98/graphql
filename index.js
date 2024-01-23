const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");

const startServer = async () => {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
    type Product {
        id: ID!
        title: String!
        description: String
        stock: Int
        rating: Int
        brand: String!
        images: [String]
    }

    type Query {
        getProducts: [Product]
        getProductById(id: ID!): Product
    }
    `,

    resolvers: {
      Query: {
        getProducts: async () => {
          const res = await axios.get("https://dummyjson.com/products");
          return res.data.products;
        },
        getProductById: async (parent, { id }) => {
          const res = await axios.get(`https://dummyjson.com/products/${id}`);
          // console.log("res", res);
          return res;
        },
      },
    },
  });

  app.use(cors());
  app.use(bodyParser.json());

  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(5001, () => console.log("Server is listening on port 5001"));
};

startServer();
