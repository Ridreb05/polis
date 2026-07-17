import Link from "next/link";
import { Plus } from "lucide-react";
import ElectionGrid from "@/components/ElectionGrid";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Elections",
  description: "Browse live, upcoming and closed on-chain governance elections on Polis.",
};

export default function ElectionsPage() {
  return (
    <div className="container-page py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Elections
          </h1>
          <p className="mt-2 text-muted-foreground">
            Every governance vote, settled on-chain and open to audit.
          </p>
        </div>
        <Button asChild>
          <Link href="/elections/create">
            <Plus /> New election
          </Link>
        </Button>
      </div>

      <ElectionGrid />
    </div>
  );
}
