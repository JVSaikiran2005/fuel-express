
import React from 'react';
import { Droplets } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };
  
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-2 rounded-full relative z-10">
          <Droplets className={`${sizeClasses[size]} text-white`} />
        </div>
      </div>
      
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} text-gray-900 dark:text-white`}>
          Fuel Express
        </span>
      )}
    </div>
  );
};

export default Logo;
