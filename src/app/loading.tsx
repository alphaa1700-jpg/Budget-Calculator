import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] w-full text-muted-foreground animate-in fade-in duration-500">
      <Loader2 className="h-10 w-10 animate-spin text-primary/50 mb-4" />
      <h2 className="text-xl font-medium tracking-tight text-foreground">Syncing data...</h2>
      <p className="text-sm mt-1 max-w-sm text-center">
        Fetching your latest financials from the Google Sheet backend.
      </p>
    </div>
  );
}
