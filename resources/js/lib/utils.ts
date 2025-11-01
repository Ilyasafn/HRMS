import { type ClassValue, clsx } from 'clsx';
import localizedFormat from 'dayjs/plugin/localizedFormat';
// import locale Indonesia
import { format, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

// Set locale global ke Indonesia
dayjs.extend(localizedFormat);
dayjs.locale('id');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const em = (e: { [key: string]: string }) => {
  return Object.entries(e)
    .map(([, v]) => v)
    .join(', ');
};

export function strLimit(text: string = '', limit: number = 50, end: string = '...'): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit - end.length) + end;
}

export function dateDFY(date: string | null) {
  return dayjs(date).format('dddd, DD MMMM YYYY');
}

export function periodeBulan(date: string | null) {
  return dayjs(date).format('MMMM YYYY');
}

export function handlePasteScreenshot(callback: (file: File) => void) {
  const onPaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image')) {
        const file = item.getAsFile();
        if (file) {
          callback(file);
        }
      }
    }
  };

  window.addEventListener('paste', onPaste);
  return () => window.removeEventListener('paste', onPaste); // biar bisa cleanup
}

// cara pakai handlePasteScreenShot

// useEffect(() => {
//   const cleanup = handlePasteScreenshot((file) => {
//     router.post(
//       route('article.upload-media', article.id),
//       {
//         file,
//       },
//       {
//         preserveScroll: true,
//         onSuccess: () => toast.success('upload completed'),
//         onError: (e) => toast.error(em(e)),
//       },
//     );
//   });

//   return cleanup;
// }, [article.id]);

export function generateSlug(text: string): string {
  const slugBase = text.replace(/\//g, '');
  return slugBase.toLowerCase().replace(/\s+/g, '-');
}

export function generatePassword(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';

  const randomChars = (charset: string, length: number): string => {
    return Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
  };

  const part1 = randomChars(letters, 4); // \w{4}
  const part2 = randomChars(digits, 4); // \d{4}

  return part1 + part2;
}

export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function copyMarkdownImage(alt: string, url: string) {
  const markdown = `![${alt}](${url})`;

  navigator.clipboard
    .writeText(markdown)
    .then(() => toast.success(`${alt} copied to clipboard`))
    .catch((err) => toast.error(err));
}

export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatRupiah(angka: number | string): string {
  const numericValue = typeof angka === 'string' ? parseFloat(angka.replace(/[^\d.-]/g, '')) : angka;

  // Handle NaN, null, undefined
  if (numericValue == null || isNaN(numericValue)) {
    return 'Rp 0';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numericValue);
}

export function parseRupiah(value: string | number): number {
  if (typeof value === 'number') return value;

  if (typeof value !== 'string') return 0;

  // Hapus semua karakter kecuali digit dan koma
  const cleaned = value
    .replace(/[^\d,]/g, '') // keep only digits and commas
    .replace(',', '.'); // ubah koma jadi titik buat decimal

  const parsed = parseFloat(cleaned);

  // Kalau hasil NaN, fallback ke 0
  return isNaN(parsed) ? 0 : parsed;
}

// utils/dateUtils.ts atau tambah di lib/utils.ts
export const isWeekend = (date: Date = new Date()): boolean => {
  const day = date.getDay(); // 0 = Minggu, 6 = Sabtu
  return day === 0 || day === 6;
};

export const isTodayWeekend = (): boolean => {
  return isWeekend(new Date());
};
export const formatPeriodeLabel = (periode: string) => {
  try {
    if (!/^\d{4}-\d{2}$/.test(periode)) return periode;
    const date = parse(periode, 'yyyy-MM', new Date());
    return format(date, 'MMMM yyyy', { locale: id });
  } catch {
    return periode;
  }
};
