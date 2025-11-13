"use client"

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";

export function Breadcrumb() {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground transition-colors">
        Pass
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">{t("vehicles")}</span>
    </nav>
  );
}

