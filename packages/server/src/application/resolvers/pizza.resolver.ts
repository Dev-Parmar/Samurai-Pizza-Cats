import { Pizza } from '../schema/types/schema';
import { pizzaProvider } from '../providers';

const pizzaResolver = {
  Query: {
    pizzas: async (): Promise<Omit<Pizza, 'toppings'>[]> => {
      return pizzaProvider.getPizzas();
    },
  },
};

export { pizzaResolver };
