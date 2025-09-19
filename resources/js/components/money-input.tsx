import React, { forwardRef, InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';

/**
 * MoneyInput
 * Komponen input uang dengan format lokal Indonesia (default: id-ID, IDR/Rp)
 * - Ketik angka bebas, otomatis diformat dengan pemisah ribuan.
 * - Nilai yang di-pass ke onValueChange adalah number (dalam unit mata uang, bukan sen), contoh: 125000.
 * - Support mata uang tanpa desimal (IDR) maupun dengan desimal (mis. USD) melalui props `decimals`.
 */

type MoneyInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  value?: number;
  onValueChange?: (value: number) => void;
  currency?: string; // default: "IDR"
  locale?: string; // default: "id-ID"
  decimals?: number; // default: 0 untuk IDR
  allowNegative?: boolean; // default: false
  /**
   * Jika true, akan tampil style tailwind bawaan komponen (ring, rounded, dll)
   */
  styled?: boolean;
};

function getSeparators(locale: string) {
  const example = 1234567.89;
  const parts = new Intl.NumberFormat(locale).formatToParts(example);
  const group = parts.find((p) => p.type === 'group')?.value ?? '.';
  const decimal = parts.find((p) => p.type === 'decimal')?.value ?? ',';
  return { group, decimal };
}

function toNumericString(input: string, locale: string, allowNegative: boolean, decimals: number) {
  const { group, decimal } = getSeparators(locale);
  // Allow digits, decimal sep, and optional leading minus if allowed
  let s = input
    .replace(new RegExp('\\\\s', 'g'), '')
    .replace(new RegExp('\\' + group, 'g'), '') // remove thousand separators
    .replace(/[A-Za-z]/g, '') // remove letters
    .replace(/[^0-9\-" + decimal + "]/g, '');

  // Normalize multiple minus signs
  if (allowNegative) {
    // keep only leading minus
    s = s.replace(/-/g, (m, offset) => (offset === 0 ? m : ''));
  } else {
    s = s.replace(/-/g, '');
  }

  // Only one decimal separator
  const firstDec = s.indexOf(decimal);
  if (firstDec !== -1) {
    s = s.slice(0, firstDec + 1) + s.slice(firstDec + 1).replace(new RegExp('\\' + decimal, 'g'), '');
    // Limit decimal places based on decimals parameter
    if (decimals === 0) {
      s = s.split(decimal)[0];
    } else {
      const parts = s.split(decimal);
      if (parts[1] && parts[1].length > decimals) {
        s = parts[0] + decimal + parts[1].slice(0, decimals);
      }
    }
  }

  // Edge: input is just "-" or just decimal
  if (s === '-' || s === decimal || s === '-') return s;

  return s;
}

function parseToNumber(numericStr: string, locale: string, decimals: number): number | null {
  if (!numericStr) return null;
  const { decimal } = getSeparators(locale);
  let s = numericStr;
  // Replace locale decimal with dot for JS parse
  if (decimals > 0) {
    s = s.replace(decimal, '.');
  } else {
    // remove any decimal separator if decimals = 0
    s = s.split(decimal)[0];
  }
  // Handle edge-only minus
  if (s === '-' || s === '' || s === '.') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function formatNumber(n: number, locale: string, currency: string, decimals: number) {
  // Use currency style to include symbol (Rp)
  const fmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return fmt.format(n);
}

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  {
    value,
    onValueChange,
    currency = 'IDR',
    locale = 'id-ID',
    decimals = currency === 'IDR' ? 0 : 2,
    allowNegative = false,
    onBlur,
    onFocus,
    ...rest
  },
  ref,
) {
  const [display, setDisplay] = useState<string>(value != null ? formatNumber(value, locale, currency, decimals) : '');
  const lastEmitted = useRef<number | null>(value ?? null);

  // Keep display synced when value prop changes externally
  useEffect(() => {
    if (value !== lastEmitted.current) {
      setDisplay(value != null ? formatNumber(value, locale, currency, decimals) : '');
      lastEmitted.current = value ?? null;
    }
  }, [value, locale, currency, decimals]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value;
    const cleaned = toNumericString(raw, locale, allowNegative, decimals);
    const num = parseToNumber(cleaned, locale, decimals);

    // Update display with formatted number if possible; otherwise keep cleaned
    if (num != null) {
      setDisplay(formatNumber(num, locale, currency, decimals));
    } else {
      setDisplay(cleaned);
    }

    if (num !== lastEmitted.current) {
      lastEmitted.current = num;
      onValueChange?.(Number(num));
    }
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    // Ensure final formatting
    const num = parseToNumber(toNumericString(display, locale, allowNegative, decimals), locale, decimals);
    setDisplay(num != null ? formatNumber(num, locale, currency, decimals) : '');
    onBlur?.(e);
  };

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    // Optional: select all for quick overwrite
    e.currentTarget.select();
    onFocus?.(e);
  };

  return (
    <Input
      ref={ref}
      inputMode={decimals > 0 ? 'decimal' : 'numeric'}
      autoComplete="off"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={formatNumber(0, locale, currency, decimals)}
      {...rest}
    />
  );
});

export default MoneyInput;
