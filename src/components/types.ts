export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  age: number;
  ip_address: string;
  active: boolean;
  active_since: string;
}

export type QueryParams = {
  tab?: string;
  fields?: {
    key: string;
    op: string;
    val: string;
    meta?: string;
  }[];
  sort?: string;
  order?: string;
  page: string;
  limit: string;
}

export type TabProps = {
  active: boolean;
}
