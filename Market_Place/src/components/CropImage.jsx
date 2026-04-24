import { cropColors } from '../data/mockData';
import { Leaf } from 'lucide-react';

export default function CropImage({ cropName, photo, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-16 h-16 rounded-xl',
    md: 'w-full h-56',
    lg: 'w-full h-80 rounded-2xl',
  };

  if (photo) {
    return (
      <div className={`${sizeClasses[size]} overflow-hidden ${className} relative group bg-gray-100`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={photo}
          alt={cropName}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>
    );
  }

  // Premium Placeholder for missing images
  const color = cropColors[cropName] || '#4caf50';
  
  return (
    <div 
      className={`${sizeClasses[size]} flex flex-col items-center justify-center relative overflow-hidden ${className} bg-gray-50`}
      style={{ backgroundColor: `${color}10` }}
    >
      {/* Abstract Agricultural Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }} />
      
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-transform duration-500 hover:rotate-12" style={{ backgroundColor: color }}>
          <Leaf className="text-white" size={32} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color }}>{cropName}</span>
      </div>
    </div>
  );
}
