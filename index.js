import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const data = {
    categories: [
      {
        id: "insects",
        speciesType: "Insects",
        beasts: [
          {
            id: "md",
            legs: 6,
            binomial: "Musca domestica",
            commonName: "housefly",
          },
          {
            id: "bt",
            legs: 6,
            binomial: "Bombus terrestris",
            commonName: "buff-tailed bumblebee",
          }
        ]
      },
      {
        id: "arachnids",
        speciesType: "Arachnids",
        beasts: [
          {
            id: "nr",
            legs: 8,
            binomial: "Neriene radiata",
            commonName: "filmy dome spider",
          }
        ]
      },
      {
        id: "birds",
        speciesType: "Birds",
        beasts: [
          {
            id: "cc",
            legs: 2,
            binomial: "Corvus corone",
            commonName: "carrion crow",
          }
        ]
      },
    ]
};

const typeDefs = `#graphql
  type Beast {
    id: ID
    legs: Int
    binomial: String
    commonName: String
  }
  type Category {
    id: ID
    speciesType: String
    beasts: [Beast]
  }
  type Query {
    categories: [Category]
    category(id: String!): Category
    beast(categoryId: String!, id: String!): Beast
  }
`;

const resolvers = {
  Query: {
    categories: () => data.categories,
    category: (parent, args) => {
      return data.categories.find((category) => category.id === args.id);
    },
    beast: (parent, args) => {
      const category = data.categories.find((cat) => cat.id === args.categoryId);
      return category ? category.beasts.find((beast) => beast.id === args.id) : null;
    }
  }
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer();