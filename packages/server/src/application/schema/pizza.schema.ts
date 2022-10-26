import { gql } from 'apollo-server';

const typeDefs = gql`
  type Pizza {
    id: ObjectID!
    name: String!
    description: String!
    toppingIds: [String!]!
    toppings: [Topping!]!
    priceCents: Int!
    imgSrc: String!
  }

  type Query {
    pizzas: [Pizza!]!
  }
`;

export { typeDefs };
