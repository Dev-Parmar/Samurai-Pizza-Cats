import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../../lib/test/renderWithProviders';
import { createTestPizza } from '../../../lib/test/helper/pizza';
import PizzaItem, { PizzaItemProps } from '../PizzaItem';
import { act } from 'react-dom/test-utils';

describe('PizzaItem', () => {
  const renderPizzaList = (props: PizzaItemProps) => {
    const view = renderWithProviders(<PizzaItem {...props} />);

    return {
      ...view,
      $getName: () => screen.getByTestId(/^pizza-name/),
      $getDescription: () => screen.getByTestId(/^pizza-description/),
      $getPrice: () => screen.getByTestId(/^pizza-price/),
      $getImage: () => screen.getByTestId(/^pizza-image/),

      $getPizzaItem: () => screen.getByTestId(/^pizza-card/),
    };
  };

  const props = {
    selectPizza: jest.fn(),
    pizza: createTestPizza(),
  };

  test('should display all components of the pizza item', async () => {
    const { $getPrice, $getName, $getDescription, $getImage } = renderPizzaList(props);

    expect($getName()).toBeVisible();
    expect($getDescription()).toBeVisible();
    expect($getPrice()).toBeVisible();
    expect($getImage()).toBeVisible();
  });

  test('should call selectPizza when the clicked on the Pizza item', async () => {
    const { $getPizzaItem } = renderPizzaList(props);

    act(() => userEvent.click($getPizzaItem()));

    expect(props.selectPizza).toHaveBeenCalledTimes(1);
  });
});
