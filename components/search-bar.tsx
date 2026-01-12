"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  variant?: "default" | "compact";
}

export function SearchBar({ className, variant = "default" }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [intent, setIntent] = useState<"buy" | "rent">("buy");
  const [beds, setBeds] = useState<string>("any");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    params.set("intent", intent);
    if (beds !== "any") params.set("beds", beds);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);

    router.push(`/search?${params.toString()}`);
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter a suburb, city, or street"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-lg border bg-card p-4 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter a suburb, city, or street (e.g. Sandton, Cape Town, 123 Main Rd)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Intent Toggle */}
          <div className="flex rounded-md border">
            <Button
              type="button"
              variant={intent === "buy" ? "default" : "ghost"}
              size="sm"
              onClick={() => setIntent("buy")}
              className="rounded-r-none"
            >
              Buy
            </Button>
            <Button
              type="button"
              variant={intent === "rent" ? "default" : "ghost"}
              size="sm"
              onClick={() => setIntent("rent")}
              className="rounded-l-none"
            >
              Rent
            </Button>
          </div>

          {/* Bedrooms */}
          <Select value={beds} onValueChange={setBeds}>
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any beds</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min price"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-32"
              min="0"
              step="50000"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max price"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-32"
              min="0"
              step="50000"
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="ml-auto">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
