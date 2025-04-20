import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  linkText: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  link,
  linkText,
  borderColor,
  iconBgColor,
  iconColor
}: FeatureCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-t-4 ${borderColor} transition hover:shadow-lg`}>
      <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center mb-4`}>
        <div className={`h-6 w-6 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={link}>
        <span className="text-[#294D98] hover:text-[#1B387A] font-medium inline-flex items-center cursor-pointer">
          {linkText}
          <ChevronRight className="h-4 w-4 ml-1" />
        </span>
      </Link>
    </div>
  );
}
