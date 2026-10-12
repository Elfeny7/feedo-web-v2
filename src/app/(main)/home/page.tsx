import type { Metadata } from "next";
import { HomeFeedView } from "@/components/views/home-feed-view";

export const metadata: Metadata = {
  title: "Home | Feedo",
  description: "Feedo Homepage",
};

export default function HomePage() {
  return <HomeFeedView />;
}