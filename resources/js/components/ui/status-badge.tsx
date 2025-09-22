import React from 'react'
import { Badge } from './badge';

const StatusBadge = ({status} : {status: string}) => {
    const isActive = status === "Aktif";
  return (
    <div>
      <Badge
      variant={'outline'}
      className={
        isActive 
        ? "bg-green-100 text-green-800 border-green-200" 
        : "bg-red-100 text-red-800 border-red-200"
    }
      >
        {status}
      </Badge>
    </div>
  )
}

export default StatusBadge
