"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NavLink } from "@/components/layout/nav-link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { type Locale, localePath } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/content/fr";

interface MobileNavProps {
  readonly locale: Locale;
  readonly dictionary: Dictionary;
}

export function MobileNav({ locale, dictionary }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={dictionary.nav.openMenu}
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>

        <nav aria-label={dictionary.nav.main} className="flex flex-col gap-1 px-4">
          {siteConfig.mainNav.map((item) => (
            <NavLink
              key={item.href}
              href={localePath(locale, item.href)}
              onNavigate={close}
              className="py-3 text-base"
            >
              {dictionary.nav[item.key]}
            </NavLink>
          ))}
          <Separator className="my-4" />
          <Button asChild onClick={close}>
            <Link href={localePath(locale, "/contact")}>{dictionary.actions.startSourcing}</Link>
          </Button>
          <Separator className="my-4" />
          <LanguageSwitcher
            locale={locale}
            label={dictionary.nav.language}
            variant="full"
            className="flex-wrap"
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
