import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
    menus: NavItem2[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface NavItem2 {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Divisi {
    id: number;
    nama: string;
    keterangan: string;
}

export type Jabatan = {
    id: number;
    nama: string;
};

export type Karyawan = {
    id: number;
    nama: string;
    nik: string;
    divisi: Divisi; // there's a relationship with Divisi
    jabatan: Jabatan; // relations with Jabatan
    alamat: string;
    nomor_telepon: string;
    tgl_masuk: Date;
    status: string[]; // e.g., 'Aktif', 'Tidak Aktif'
};
