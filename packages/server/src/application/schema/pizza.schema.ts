import { gql } from 'apollo-server';

const typeDefs = gql`
  type Pizza {
    id: ObjectID!
    name: String!
    description: String!
    toppingIds: [String!]!
    toppings: [Topping!]!
    priceCents: Long!
    imgSrc: String!
  }

  type GetPizzasResponse {
    results: [Pizza!]
    totalCount: Int!
    hasNextPage: Boolean!
    cursor: String
  }

  type Query {
    pizzas(input: PizzasInput): GetPizzasResponse!
  }

  input PizzasInput {
    cursor: ObjectID
    limit: Int
  }

  type Mutation {
    createPizza(input: CreatePizzaInput!): Pizza!
    updatePizza(input: UpdatePizzaInput!): Pizza!
    deletePizza(input: DeletePizzaInput!): ObjectID!
  }

  input CreatePizzaInput {
    name: String!
    description: String!
    toppingIds: [ObjectID!]!
    imgSrc: String!
  }

  input UpdatePizzaInput {
    id: ObjectID!
    name: String
    description: String
    toppingIds: [ObjectID!]
    imgSrc: String
  }

  input DeletePizzaInput {
    id: ObjectID!
  }
`;

export { typeDefs };
