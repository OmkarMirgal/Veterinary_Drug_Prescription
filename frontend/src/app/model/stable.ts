export interface IStableData {
  id: number;
  name: string;
  location: string;
  owner: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ICreateStable {
  name: string;
  location: string;
  owner: string;
}

