import StreetClient from "@/components/street-client";
import { streetItemOfTheDay } from "@/data/street";

export const metadata = { title: "Street German — DeutschPraxis" };

export default function StreetPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Street German 🇩🇪</h1>
        <p className="text-muted-foreground">
          Real German you meet in daily life — signs, announcements, menus, letters. A new item every day.
        </p>
      </div>
      <StreetClient itemOfTheDay={streetItemOfTheDay()} />
    </div>
  );
}
