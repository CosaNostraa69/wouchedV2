import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number;
}

export const StarRating = ({ rating }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < fullStars ? (
            <Star className="fill-yellow-400 text-yellow-400" />
          ) : i === fullStars && hasHalfStar ? (
            <StarHalf className="fill-yellow-400 text-yellow-400" />
          ) : (
            <Star className="text-gray-300" />
          )}
        </span>
      ))}
    </div>
  )
}