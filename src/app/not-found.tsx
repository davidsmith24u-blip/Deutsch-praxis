import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">This page doesn’t exist.</p>
      <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Go home
      </Link>
    </div>
  );
}