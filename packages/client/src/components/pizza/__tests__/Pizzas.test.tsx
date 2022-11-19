import { screen, waitFor } from '@testing-library/react';
import { graphql } from 'msw';

import { renderWithProviders } from '../../../lib/test/renderWithProviders';
import { Pizza } from '../../../types';

import { server } from '../../../lib/test/msw-server';
import { createTestPizza } from '../../../lib/test/helper/pizza';
import Pizzas from '../Pizzas';

describe('Pizzas', () => {
  const renderPizzaList = () => {
    const view = renderWithProviders(<Pizzas />);

    return {
      ...view,
      $findPizzaItems: () => screen.findAllByTestId(/^pizza-item-/),
      $visiblePizzaItem: () => screen.queryByTestId('pizza-list-loading'),
      $findShowMoreButton: () => screen.queryByText('See More Pizzas'),
    };
  };

  const mockPizzasQuery = (data: Partial<Pizza[]>) => {
    server.use(
      graphql.query('Pizzas', (_request, response, context) => {
        return response(
          context.data({
            loading: false,
            pizzas: {
              results: [...data],
              totalCount: 8,
              cursor: null,
              hasNextPage: true,
            },
          })
        );
      }),
      graphql.query('Toppings', (_request, response, context) => {
        return response(context.data({}));
      })
    );
  };

  beforeEach(async () => {
    const pizza1 = createTestPizza();
    const pizza2 = createTestPizza();
    mockPizzasQuery([pizza1, pizza2]);
  });

  test('should display a list of pizzas', async () => {
    await waitFor(async () => {
      const { $findPizzaItems } = renderPizzaList();

      expect(await $findPizzaItems()).toHaveLength(2);
    });
  });

  test('test id visible while loading', async () => {
    await waitFor(async () => {
      const { $visiblePizzaItem } = renderPizzaList();

      expect($visiblePizzaItem()).not.toBeNull();
    });
  });

  test('see more pizzas button not visible when hasNextPage is false', async () => {
    await waitFor(async () => {
      const { $findShowMoreButton } = renderPizzaList();

      expect(await $findShowMoreButton()).toBeNull();
    });
  });
});
