import { Collection, ObjectId } from 'mongodb';
import validateStringInputs from '../../../lib/string-validator';
import { PizzaDocument, toPizzaObject } from '../../../entities/pizza';
import { CreatePizzaInput, Pizza, UpdatePizzaInput } from './pizza.provider.types';
import { toppingProvider } from '..';

class PizzaProvider {
  constructor(private collection: Collection<PizzaDocument>) {}

  public async getPizzas(): Promise<Pizza[]> {
    const pizzas = await this.collection.find().sort({ name: 1 }).toArray();
    return pizzas.map(toPizzaObject);
  }

  public async createPizza(input: CreatePizzaInput): Promise<Pizza> {
    const { name, description, toppingIds, imgSrc } = input;

    validateStringInputs([name, description, imgSrc]);

    const toppingObjectIds = toppingIds.map((id) => new ObjectId(id));

    //APP crashing when I call function(validateTopping) to throw an error but works fine when I do it without calling function
    // toppingProvider.validateToppings(toppingIds)

    //I wrote the function here for validateToppings instead of calling it
    const toppingData = await toppingProvider.getToppingsById(toppingIds);
    const toppings = toppingData.map((toppings) => new ObjectId(toppings.id));

    if (toppingIds.length !== toppings.length) {
      throw new Error('Invalid toppings');
    }

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId() },
      {
        $set: {
          ...(name && { name: name }),
          ...(description && { description: description }),
          ...(toppingIds && { toppingIds: toppingObjectIds }),
          ...(imgSrc && { imgSrc: imgSrc }),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not create the ${input.name} pizza`);
    }
    const pizza = data.value;
    return toPizzaObject(pizza);
  }

  public async updatePizza(input: UpdatePizzaInput): Promise<Pizza> {
    const { id, name, description, toppingIds, imgSrc } = input;
    let toppingObjectIds;

    const inputArr = Object.values(input);
    inputArr.forEach((value) => {
      validateStringInputs(value);
    });

    if (toppingIds) {
      toppingObjectIds = toppingIds.map((id) => new ObjectId(id));
    }

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(name && { name: name }),
          ...(description && { description: description }),
          ...(toppingIds && { toppingIds: toppingObjectIds }),
          ...(imgSrc && { imgSrc: imgSrc }),
        },
      },
      { returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not update the pizza`);
    }
    const pizza = data.value;

    return toPizzaObject(pizza);
  }

  public async deletePizza(id: string): Promise<string> {
    const pizzaId = new ObjectId(id);
    const pizzaData = await this.collection.findOneAndDelete({
      _id: pizzaId,
    });

    const pizza = pizzaData.value;

    if (!pizza) {
      throw new Error(`Could not delete the pizza`);
    }

    return id;
  }
}

export { PizzaProvider };
