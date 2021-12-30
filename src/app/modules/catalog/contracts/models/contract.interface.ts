// DataSource for Contract
import {Links} from "../../../../shared/interfaces/shared.interface";

export interface ModelContract {
  total: number;
  next?: Links["next"];
  previous?: Links["prev"];
  data: Contract[];
}

export interface Contract {
  id?: number;
  name: string;
  description: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Data Paginate
export interface ContractPaginate {
  page: string,
  page_size: string
}

export interface ContractDetail {
  data: Contract
}
