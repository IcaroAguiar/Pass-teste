"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Truck } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";

interface SidebarNavProps {
  isCollapsed?: boolean;
}

export function SidebarNav({ isCollapsed = false }: SidebarNavProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const navItems = [
    {
      title: t("main"),
      items: [
        {
          title: t("vehicles"),
          href: "/veiculos",
          icon: Truck,
        },
      ],
    },
  ];

  return (
    <nav className={cn("space-y-6 w-full", isCollapsed && "space-y-4")}>
      {navItems.map((group) => (
        <div key={group.title} className={cn("space-y-2", isCollapsed && "flex flex-col items-center")}>
          {!isCollapsed && (
            <h3 className="text-xs font-medium text-white uppercase tracking-wider px-2">
              {group.title}
            </h3>
          )}
          <div className={cn("space-y-1", isCollapsed && "flex flex-col items-center w-full")}>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg transition-colors",
                    isCollapsed
                      ? "h-8 w-8 justify-center p-0"
                      : "gap-3 px-3 py-2",
                    isActive
                      ? "bg-[#262626] text-white"
                      : "text-white hover:bg-accent hover:text-accent-foreground"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn("h-4 w-4 text-white shrink-0")} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

