import { CreatePizzaInput, DeletePizzaInput, Pizza, UpdatePizzaInput } from '../schema/types/schema';
import { Root } from '../schema/types/types';
import { pizzaProvider } from '../providers';

const pizzaResolver = {
  Query: {
    pizzas: async (): Promise<Omit<Pizza, 'toppings' | 'priceCents'>[]> => {
      return pizzaProvider.getPizzas();
    },
  },

  Mutation: {
    createPizza: async (
      _: Root,
      args: { input: CreatePizzaInput }
    ): Promise<Omit<Pizza, 'toppings' | 'priceCents'>> => {
      return pizzaProvider.createPizza(args.input);
    },

    updatePizza: async (
      _: Root,
      args: { input: UpdatePizzaInput }
    ): Promise<Omit<Pizza, 'toppings' | 'priceCents'>> => {
      return pizzaProvider.updatePizza(args.input);
    },

    deletePizza: async (_: Root, args: { input: DeletePizzaInput }): Promise<string> => {
      return pizzaProvider.deletePizza(args.input.id);
    },
  },
};

export { pizzaResolver };
