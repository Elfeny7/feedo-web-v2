import type { Metadata } from "next";
import { HomeFeedView } from "@/features/feed/view/home-feed-view";

export const metadata: Metadata = {
  title: "Home | Feedo",
  description: "Feedo Homepage",
};

export default function HomePage() {
  return <HomeFeedView />;
}