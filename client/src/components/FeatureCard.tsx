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
    <div className={`bg-white rounded-xl shadow-md p-8 border-t-4 ${borderColor} transition hover:shadow-xl hover:translate-y-[-5px] group`}>
      <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <div className={`h-8 w-8 ${iconColor}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#1B387A] transition-colors">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      <div className="pt-2 border-t border-gray-100">
        <Link href={link}>
          <span className="text-[#294D98] hover:text-[#1B387A] font-medium inline-flex items-center cursor-pointer group-hover:translate-x-1 transition-transform">
            {linkText}
            <ChevronRight className="h-4 w-4 ml-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}
