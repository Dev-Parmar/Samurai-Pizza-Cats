import { Collection, ObjectId } from 'mongodb';
import validateStringInputs from '../../../lib/string-validator';
import { PizzaDocument, toPizzaObject } from '../../../entities/pizza';
import { CreatePizzaInput, PizzasInput, Pizza, UpdatePizzaInput, GetPizzasResponse } from './pizza.provider.types';
import { ToppingProvider } from '../toppings/topping.provider';

class PizzaProvider {
  constructor(private collection: Collection<PizzaDocument>, private toppingProvider: ToppingProvider) {}

  public async getCursorIndex(cursor?: ObjectId | null): Promise<number> {
    const cursorIndex = await this.collection.countDocuments({
      _id: { $lte: cursor },
    });

    return cursorIndex;
  }

  public async getCursorResults(limit?: number | null, cursor?: ObjectId | null): Promise<GetPizzasResponse> {
    const cursorIndex: number = await this.getCursorIndex(cursor ? cursor : null);

    let newLimit: number = 0;

    if (limit === 0) {
      newLimit = 0;
    } else if (limit === null) {
      newLimit = 5;
    } else if (limit) {
      newLimit = limit;
    }

    const pizzaData = await this.collection.find().sort({ _id: 1 }).skip(cursorIndex).limit(newLimit).toArray();

    let lastItem: any = pizzaData[pizzaData.length - 1]._id;

    const results = pizzaData.map(toPizzaObject);
    const totalCount: number = pizzaData.length;
    let hasNextPage: boolean = true;

    const isLastItem = await this.collection.findOne({ _id: { $gt: lastItem } });
    if (isLastItem) {
      hasNextPage = true;
    } else {
      hasNextPage = false;
      lastItem = null;
    }

    return {
      hasNextPage: hasNextPage,
      totalCount: totalCount,
      cursor: lastItem ? lastItem.toHexString() : null,
      results: results,
    };
  }

  public async getPizzas(input: PizzasInput): Promise<GetPizzasResponse> {
    const pizzas = await this.getCursorResults(input.limit, input.cursor ? new ObjectId(input.cursor) : null);
    return pizzas;
  }

  public async createPizza(input: CreatePizzaInput): Promise<Pizza> {
    const { name, description, toppingIds, imgSrc } = input;

    validateStringInputs([name, description, imgSrc]);

    const toppingObjectIds = toppingIds.map((id) => new ObjectId(id));

    await this.toppingProvider.validateToppings(toppingIds);

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

    if (toppingIds) {
      await this.toppingProvider.validateToppings(toppingIds);
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
