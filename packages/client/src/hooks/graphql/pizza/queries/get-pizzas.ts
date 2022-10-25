import { gql } from '@apollo/client';

const GET_PIZZAS = gql`
  query Pizzas {
    pizzas {
      toppings {
        name
        priceCents
        id
      }
      name
      id
      description
      imgSrc
    }
  }
`;

export { GET_PIZZAS };
