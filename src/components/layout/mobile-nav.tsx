"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavLink } from "@/components/layout/nav-link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
          {siteConfig.mainNav.map((item) => (
            <NavLink key={item.href} href={item.href} onNavigate={close} className="py-3 text-base">
              {item.title}
            </NavLink>
          ))}
          <Separator className="my-4" />
          <Button asChild onClick={close}>
            <Link href="/contact">Get in touch</Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
