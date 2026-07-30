import CampaignArena from "@/components/campaign/CampaignArena";
import { notFound } from "next/navigation";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Phase 10: Fetch campaign from database to ensure it exists
  // For now, we mock the existence of "apple-vs-android"
  if (slug !== "apple-vs-android") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <CampaignArena />
    </main>
  );
}
