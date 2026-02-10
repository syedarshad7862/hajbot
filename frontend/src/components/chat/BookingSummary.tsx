import { Button } from "@/components/ui/button";
import { Calendar, Users, Plane, MapPin, CreditCard } from "lucide-react";

interface BookingSummaryProps {
  selectedPackage?: {
    title: string;
    price: string;
    duration: string;
  };
  travelDate?: string;
  passengers?: number;
}

const BookingSummary = ({
  selectedPackage,
  travelDate = "Select Date",
  passengers = 1,
}: BookingSummaryProps) => {
  return (
    <aside className="hidden lg:block w-80 xl:w-96 bg-card border-l border-border h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="font-serif text-xl font-bold text-foreground mb-6">
          Booking Summary
        </h2>

        {selectedPackage ? (
          <div className="space-y-6">
            {/* Selected Package */}
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">
                    {selectedPackage.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedPackage.duration}
                  </p>
                </div>
              </div>
            </div>

            {/* Travel Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Travel Date</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {travelDate}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Passengers</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {passengers}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Destination</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  Makkah & Madinah
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Package Price</span>
                <span className="text-foreground">{selectedPackage.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span className="text-foreground">Included</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-gradient-gold">{selectedPackage.price}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button variant="gold" className="w-full" size="lg">
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Payment
              </Button>
              <Button variant="outline" className="w-full">
                Modify Selection
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Select a package to see booking details
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default BookingSummary;
