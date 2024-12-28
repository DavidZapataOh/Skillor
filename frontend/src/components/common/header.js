"use client";
import { FireIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import AuthButton from "@/config/authButton";

const StarIcon = ({ className, fill }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill={fill}
    stroke="#141414"
    strokeWidth="2"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const renderStars = (count) => {
  const stars = [];
  const fullStars = Math.floor(count);
  const hasHalfStar = count % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <StarIcon 
          key={i} 
          className="w-4 h-4" 
          fill="#7FB800"
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative w-4 h-4">
          <StarIcon 
            className="absolute w-4 h-4" 
            fill="#141414"
          />
          <div className="absolute w-2 h-4 overflow-hidden">
            <StarIcon 
              className="w-4 h-4" 
              fill="#7FB800"
            />
          </div>
        </div>
      );
    } else {
      stars.push(
        <StarIcon 
          key={i} 
          className="w-4 h-4" 
          fill="#141414"
        />
      );
    }
  }
  return stars;
};

export default function Header() {
  const averageStars = 3.5;

  return (
    <header className="ml-64 flex justify-between items-center px-6 py-4 bg-background shadow-lg border-b border-muted relative z-10">
      <h1 className="text-lg font-bold text-primary">SKILLOR</h1>
      
      <div className="flex items-center gap-12">
        <div className="flex items-center bg-primary p-2 rounded-lg">
          <div className="flex gap-0.5">
            {renderStars(averageStars)}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-background_secondary px-4 py-2 rounded-lg">
          <FireIcon className="w-6 h-6 text-primary" />
          <span className="text-text font-medium">12</span>
        </div>

        <div className="flex items-center gap-1 bg-primary px-4 py-2 rounded-lg">
          <CurrencyDollarIcon className="w-6 h-6 text-background" />
          <span className="text-background font-semibold">2,450</span>
        </div>

        

        <AuthButton />
      </div>
    </header>
  );
}
  

  