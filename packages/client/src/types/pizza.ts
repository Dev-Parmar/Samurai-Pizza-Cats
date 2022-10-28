import { Topping } from './topping';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppingIds: string[];
  toppings: Topping[];
  priceCents: number;
  imgSrc: string;
}
