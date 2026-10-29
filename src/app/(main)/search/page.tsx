import type { Metadata } from "next";
import { SearchView } from "@/features/search/view/search-view";

export const metadata: Metadata = {
  title: "Explore | Feedo",
  description: "Explore Feedo",
};

export default function SearchPage() {
    return <SearchView />
}