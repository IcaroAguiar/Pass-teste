"use client"

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground transition-colors">
        Pass
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">Veículos</span>
    </nav>
  );
}

