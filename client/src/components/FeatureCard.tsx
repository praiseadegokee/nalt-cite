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
    <div className={`bg-white rounded-lg shadow-md p-5 sm:p-6 border-t-4 ${borderColor} transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] group`}>
      <div className="flex items-start">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBgColor} rounded-full flex items-center justify-center mr-4 sm:mr-0 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <div className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
        
        <div className="sm:mt-4 flex-1 sm:flex-none">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 group-hover:text-[#1B387A] transition-colors duration-300">{title}</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">{description}</p>
          <Link href={link}>
            <span className="text-[#294D98] hover:text-[#1B387A] font-medium inline-flex items-center cursor-pointer text-sm sm:text-base group-hover:translate-x-1 transition-transform duration-300 ease-in-out">
              {linkText}
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
