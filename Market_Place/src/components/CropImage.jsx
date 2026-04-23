import { cropColors } from '../data/mockData';

export default function CropImage({ cropName, photo, className = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-full h-32',
    md: 'w-full h-48',
    lg: 'w-full h-64',
  };

  if (photo) {
    return (
      <div className={`${sizeClasses[size]} overflow-hidden ${className}`}>
        <img
          src={photo}
          alt={cropName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  const bgColor = cropColors[cropName] || '#4caf50';
  const isLight = ['#fdd835', '#ffeb3b', '#ffc107', '#eceff1', '#ffe082', '#fbc02d'].includes(bgColor);

  return (
    <div
      className={`${sizeClasses[size]} flex flex-col items-center justify-center relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${bgColor}dd, ${bgColor}99)` }}
    >
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <pattern id={`pattern-${cropName}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.3" />
          </pattern>
          <rect width="200" height="200" fill={`url(#pattern-${cropName})`} />
        </svg>
      </div>
      <div className="text-4xl mb-2">🌾</div>
      <span className={`text-sm font-semibold relative z-10 px-3 py-1 rounded-full ${isLight ? 'text-gray-800 bg-white/40' : 'text-white bg-black/20'}`}>
        {cropName}
      </span>
    </div>
  );
}
