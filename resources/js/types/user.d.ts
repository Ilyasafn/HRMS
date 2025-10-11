import { Divisi } from './divisi';
import { Role } from './role';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  roles?: Role[];
  email_verified_at: string | null;
  nik: string;
  divisi: Divisi;
  tgl_lahir: string | null;
  jenis_kelamin: 'Laki-laki' | 'Perempuan' | null;
  alamat: string | null;
  no_telp: string | null;
  tgl_masuk: string;
  status: 'Aktif' | 'Tidak Aktif';
  sisa_cuti_tahunan: string;
  total_cuti_diambil: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}
