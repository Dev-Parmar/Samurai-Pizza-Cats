import { ObjectId, Collection } from 'mongodb';
import { ToppingDocument, toToppingObject } from '../../../entities/topping';
import { CreateToppingInput, Topping, UpdateToppingInput } from './topping.provider.types';
import validateStringInputs from '../../../lib/string-validator';

class ToppingProvider {
  constructor(private collection: Collection<ToppingDocument>) {}

  public async validateToppings(givenId: string[]): Promise<void> {
    const toppingData = await this.getToppingsById(givenId);
    const toppingIds = toppingData.map((toppings) => new ObjectId(toppings.id));

    if (toppingIds.length !== givenId.length) {
      throw new Error('Invalid toppings');
    }
  }

  public async getToppingsById(toppingIds: string[]): Promise<Topping[]> {
    const toppingObjectIds = toppingIds.map((id) => new ObjectId(id));
    const toppings = await this.collection
      .find({
        _id: { $in: toppingObjectIds },
      })
      .sort({ name: 1 })
      .toArray();
    return toppings.map(toToppingObject);
  }

  public async getPriceCents(toppingIds: string[]): Promise<number> {
    const toppingObjectIds = toppingIds.map((id) => new ObjectId(id));
    const toppingData = await this.collection
      .find(
        {
          _id: { $in: toppingObjectIds },
        },
        {
          projection: { priceCents: 1, _id: 0 },
        }
      )
      .toArray();

    let toppingsPrice: number[] = toppingData.map((amount) => amount.priceCents);
    return toppingsPrice.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }

  public async getToppings(): Promise<Topping[]> {
    const toppings = await this.collection.find().sort({ name: 1 }).toArray();
    return toppings.map(toToppingObject);
  }

  public async createTopping(input: CreateToppingInput): Promise<Topping> {
    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId() },
      { $set: { ...input, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() } },
      { upsert: true, returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not create the ${input.name} topping`);
    }
    const topping = data.value;

    return toToppingObject(topping);
  }

  public async deleteTopping(id: string): Promise<string> {
    const toppingId = new ObjectId(id);
    const toppingData = await this.collection.findOneAndDelete({
      _id: toppingId,
    });

    const topping = toppingData.value;

    if (!topping) {
      throw new Error(`Could not delete the topping`);
    }

    return id;
  }

  public async updateTopping(input: UpdateToppingInput): Promise<Topping> {
    const { id, name, priceCents } = input;

    if (name) validateStringInputs(name);

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...(name && { name: name }), ...(priceCents && { priceCents: priceCents }) } },
      { returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not update the topping`);
    }
    const topping = data.value;

    return toToppingObject(topping);
  }
}

export { ToppingProvider };
