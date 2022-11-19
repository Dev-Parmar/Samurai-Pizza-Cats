import { gql } from '@apollo/client';

const GET_PIZZAS = gql`
  query Pizzas($input: PizzasInput) {
    pizzas(input: $input) {
      results {
        id
        name
        description
        toppingIds
        toppings {
          id
          name
          priceCents
        }
        priceCents
        imgSrc
      }
      totalCount
      cursor
      hasNextPage
    }
  }
`;

export { GET_PIZZAS };
