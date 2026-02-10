import { Button } from "@/components/ui/button";
import { Star, Calendar, MapPin, Users } from "lucide-react";

interface PackageCardProps {
  title: string;
  price: string;
  duration: string;
  rating?: number;
  location?: string;
  highlights?: string[];
  onViewDetails?: () => void;
  onBookNow?: () => void;
}

const PackageCard = ({
  title,
  price,
  duration,
  rating = 4.8,
  location = "Makkah & Madinah",
  highlights = [],
  onViewDetails,
  onBookNow,
}: PackageCardProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-soft hover:shadow-lg transition-all duration-300 animate-scale-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground text-base leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{location}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-xs font-medium text-accent-foreground">{rating}</span>
        </div>
      </div>

      {/* Details Row */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Per Person</span>
        </div>
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <ul className="mb-3 space-y-1">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {/* Price & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <span className="text-2xl font-bold text-gradient-gold">{price}</span>
          <span className="text-xs text-muted-foreground ml-1">onwards</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            Details
          </Button>
          <Button variant="gold" size="sm" onClick={onBookNow}>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
