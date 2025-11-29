import { User } from './user';

export type Payroll = {
  id: number;
  user_id: User['id'];
  user: User;
  periode: string | null;
  periode_label: string;
  jumlah_karyawan: string;
  periode_bulan: string;
  gaji_pokok: number;
  tunjangan: number;
  potongan: number;
  total_gaji: number;
  tanggal: string;
  status: string;
  approval_status: string;
  approved_by?: User['id'];
  approver?: User;
  approved_at: string;
  created_at: string;
  updated_at: string;
  pending_counts: number;
};
