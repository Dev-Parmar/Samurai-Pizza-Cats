import { gql } from 'apollo-server-core';

import { pizzaResolver } from '../../src/application/resolvers/pizza.resolver';
import { pizzaProvider } from '../../src/application/providers';
import { typeDefs } from '../../src/application/schema/index';

import {
  MutationCreatePizzaArgs,
  MutationDeletePizzaArgs,
  MutationUpdatePizzaArgs,
  QueryPizzasArgs,
} from '../../src/application/schema/types/schema';

import { createMockPizza } from '../helpers/pizza.helper';
import { TestClient } from '../helpers/client.helper';

let client: TestClient;

jest.mock('../../src/application/database', () => ({
  setupDb: (): any => ({ collection: (): any => jest.fn() }),
}));

const mockPizza = createMockPizza();

beforeAll(async (): Promise<void> => {
  client = new TestClient(typeDefs, pizzaResolver);
});

beforeEach(async (): Promise<void> => {
  jest.restoreAllMocks();
});

describe('pizzaResolver', (): void => {
  describe('Query', () => {
    describe('pizzas', () => {
      const query = gql`
        query Query($input: PizzasInput!) {
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
            hasNextPage
            cursor
          }
        }
      `;

      test('should get all pizzas', async () => {
        jest.spyOn(pizzaProvider, 'getPizzas').mockResolvedValue({
          results: [mockPizza],
          cursor: null,
          hasNextPage: true,
          totalCount: 5,
        });

        const variables: QueryPizzasArgs = {
          input: {
            limit: null,
            cursor: null,
          },
        };
        const result = await client.query({ query, variables });

        expect(result.data.pizzas.results).toEqual([
          {
            __typename: 'Pizza',
            id: mockPizza.id,
            name: mockPizza.name,
            description: mockPizza.description,
            toppingIds: mockPizza.toppingIds,
            toppings: mockPizza.toppings,
            priceCents: mockPizza.priceCents,
            imgSrc: mockPizza.imgSrc,
          },
        ]);

        expect(pizzaProvider.getPizzas).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Mutation', () => {
    describe('createPizza', () => {
      const mutation = gql`
        mutation ($input: CreatePizzaInput!) {
          createPizza(input: $input) {
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
        }
      `;

      const validPizza = createMockPizza({
        name: 'test pizza',
        description: 'test description',
        toppingIds: ['09f2c64eafb205328d2ba343', '564f0184537878b57efcb703'],
        imgSrc:
          'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
      });

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'createPizza').mockResolvedValue(validPizza);
      });

      test('should call create pizza when passed a valid input', async () => {
        const variables: MutationCreatePizzaArgs = {
          input: {
            name: validPizza.name,
            description: validPizza.description,
            toppingIds: validPizza.toppingIds,
            imgSrc: validPizza.imgSrc,
          },
        };

        await client.mutate({ mutation, variables });

        expect(pizzaProvider.createPizza).toHaveBeenCalledWith(variables.input);
      });

      test('should return created pizza when passed a valid input', async () => {
        const variables: MutationCreatePizzaArgs = {
          input: {
            name: validPizza.name,
            description: validPizza.description,
            toppingIds: validPizza.toppingIds,
            imgSrc: validPizza.imgSrc,
          },
        };

        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          createPizza: {
            __typename: 'Pizza',
            name: validPizza.name,
            description: validPizza.description,
            toppingIds: validPizza.toppingIds,
            toppings: validPizza.toppings,
            priceCents: validPizza.priceCents,
            imgSrc: validPizza.imgSrc,
          },
        });
      });
    });

    describe('updatePizza', () => {
      const mutation = gql`
        mutation ($input: UpdatePizzaInput!) {
          updatePizza(input: $input) {
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
        }
      `;

      const updatedPizza = createMockPizza({
        name: 'update pizza',
        description: 'update description',
        toppingIds: ['09f2c64eafb205328d2ba343'],
      });

      const variables: MutationUpdatePizzaArgs = {
        input: {
          id: mockPizza.id,
          name: updatedPizza.name,
          description: updatedPizza.description,
          toppingIds: updatedPizza.toppingIds,
        },
      };

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'updatePizza').mockResolvedValue(updatedPizza);
      });

      test('should call updatePizza with input', async () => {
        await client.mutate({ mutation, variables });

        expect(pizzaProvider.updatePizza).toHaveBeenCalledWith(variables.input);
      });

      test('should return updated pizza', async () => {
        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          updatePizza: {
            ...updatedPizza,
          },
        });
      });
    });

    describe('deletePizza', () => {
      const mutation = gql`
        mutation ($input: DeletePizzaInput!) {
          deletePizza(input: $input)
        }
      `;

      const variables: MutationDeletePizzaArgs = { input: { id: mockPizza.id } };

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'deletePizza').mockResolvedValue(mockPizza.id);
      });

      test('should call deletePizza with id', async () => {
        await client.mutate({ mutation, variables });

        expect(pizzaProvider.deletePizza).toHaveBeenCalledWith(variables.input.id);
      });

      test('should return deleted pizza id', async () => {
        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          deletePizza: mockPizza.id,
        });
      });
    });
  });
});
