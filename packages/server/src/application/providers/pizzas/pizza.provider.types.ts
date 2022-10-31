export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppingIds: string[];
  imgSrc: string;
}

export interface CreatePizzaInput {
  name: string;
  description: string;
  toppingIds: string[];
  imgSrc: string;
}

export interface UpdatePizzaInput {
  id: string;
  name?: string | null;
  description?: string | null;
  toppingIds?: string[] | null;
  imgSrc?: string | null;
}
