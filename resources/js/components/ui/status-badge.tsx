import { Badge } from "@/components/ui/badge";

type Props = {
  status: string;
};

const StatusBadge = ({ status }: Props) => {
  const normalized = status.toLowerCase();

  // semua mapping status (user, absensi, approval campur jadi satu)
  const statusMap: Record<string, string> = {
    // User
    "aktif": "bg-green-200 text-green-800 border-green-200",
    "tidak aktif": "bg-red-200 text-red-800 border-red-200",

    // Absensi
    "hadir": "bg-green-200 text-green-800 border-green-200",
    "telat": "bg-orange-200 text-orange-800 border-orange-200",
    "izin": "bg-yellow-200 text-yellow-800 border-yellow-200",
    "sakit": "bg-slate-200 text-slate-800 border-slate-200",
    "alpha": "bg-red-200 text-red-800 border-red-200",

    // Approval
    "pending": "bg-yellow-200 text-yellow-800 border-yellow-200",
    "approved": "bg-green-200 text-green-800 border-green-200",
    "rejected": "bg-red-200 text-red-800 border-red-200",
  };

  const classes =
    statusMap[normalized] ||
    "bg-slate-200 text-slate-800 border-slate-200";

  const label =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return <Badge className={classes}>{label}</Badge>;
};

export default StatusBadge;
