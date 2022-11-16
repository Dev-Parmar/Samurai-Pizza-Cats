export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppingIds: string[];
  imgSrc: string;
}

export interface GetPizzasResponse {
  results?: Pizza[] | null;
  hasNextPage: boolean;
  totalCount: number;
  cursor?: string | null;
}

export interface PizzasInput {
  cursor?: string | null;
  limit?: number | null;
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
