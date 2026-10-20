import type { Metadata } from "next";
import { SearchView } from "@/components/views/search-view";

export const metadata: Metadata = {
  title: "Explore | Feedo",
  description: "Explore Feedo",
};

export default function SearchPage() {
    return <SearchView />
}