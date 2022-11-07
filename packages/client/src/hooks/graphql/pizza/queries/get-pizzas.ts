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
      toppingIds
      description
      imgSrc
      priceCents
    }
  }
`;

export { GET_PIZZAS };
