export type Role = {
  id: number;
  name: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
};

export type Permission = {
  id: number;
  group: string;
  name: string;
};
