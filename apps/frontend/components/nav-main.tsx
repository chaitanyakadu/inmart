"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NavMain({
  items,
  path,
  setPath,
}: {
  items: {
    title: string;
    url: string;
    icon?: any;
  }[];
  path: string;
  setPath: any;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}
              onClick={() => {
                setPath(item.url);
              }}
            >
              <Link href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`${path === item.url && "bg-sidebar-accent"}`}
                >
                  {item.icon && (
                    <Image
                      src={item.icon}
                      alt="icon"
                      height={100}
                      width={100}
                      className="h-5 w-fit"
                    />
                  )}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
