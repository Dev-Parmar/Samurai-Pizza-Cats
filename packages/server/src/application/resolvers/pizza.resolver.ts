import { Pizza } from '../schema/types/schema';
import { pizzaProvider } from '../providers';

const pizzaResolver = {
  Query: {
    pizzas: async (): Promise<Omit<Pizza, 'toppings' | 'priceCents'>[]> => {
      return pizzaProvider.getPizzas();
    },
  },
};

export { pizzaResolver };
