import { Media } from '.';
import { User } from './user';

export type Absensi = {
  id: number;
  media: Media[];
  user: User;
  media: Media[];
  tanggal: string | null;
  media: Media[];
  jam_masuk: string | null;
  media: Media[];
  jam_keluar: string | null;
  media: Media[];
  status: string | null;
  media: Media[];
  keterangan: string | null;
  media: Media[];
  approval_status: string;
  media: Media[];
  approved_by: User;
  media: Media[];
  approved_at: string;
  created_at: string;
  updated_at: string;
  user_counts?: number;
  pending_counts: number;
  isAdmin: boolean | number;
};

export type TotalAbsensi = {
  hadir: string;
  telat: string;
  izin: string;
  cuti: string;
  alpha: string;
  total: string;
};

export type ChartData = {
  month: string;
  hadir: number;
  telat: number;
  alpha: number;
  izin: number;
  cuti: number;
}[];
