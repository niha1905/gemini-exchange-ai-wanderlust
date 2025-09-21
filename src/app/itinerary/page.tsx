import { ItineraryForm } from "./itinerary-form";

export default function ItineraryPage() {
  return (
    <div>
      <p className="mb-6 text-muted-foreground">
        Leverage AI to create a personalized travel itinerary. Fill in your preferences below, and our smart planner will craft the perfect trip for you, optimized for route, time, and experience.
      </p>
      <ItineraryForm />
    </div>
  );
}
