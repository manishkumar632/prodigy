import Link from 'next/link';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  link: string;
}

export default function DashboardCard({ title, value, icon, color, link }: DashboardCardProps) {
  return (
    <Link href={link} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex items-center">
            <div className={`${color} rounded-full p-3 mr-4 text-white`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
        <div className={`${color} h-1`}></div>
      </div>
    </Link>
  );
} 