export type Role = {
  id: number;
  name: string;
  permissions?: Permission[];
  gaji_pokok: string,
  tunjangan: string,
  created_at?: string;
  updated_at?: string;
};

export type Permission = {
  id: number;
  group: string;
  name: string;
};
