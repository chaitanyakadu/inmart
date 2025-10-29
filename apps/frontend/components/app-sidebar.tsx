"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  dashboardSvg,
  filterSvg,
  inlineLoadingSvg,
  profileSvg,
  serviceSvg,
  settingsSvg,
} from "@/public/images";
import Image from "next/image";
import { useUserDetails } from "@/hooks/use-data";
import { usePathname } from "next/navigation";

const initialData = {
  user: {
    name: "shadcn",
    email: "etc@ybc.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: dashboardSvg,
    },
    {
      title: "Service",
      url: "/service",
      icon: serviceSvg,
    },
    {
      title: "Filters",
      url: "/filters",
      icon: filterSvg,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: profileSvg,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [data, setData] = React.useState(initialData);
  const [userDetails, userDetailsPending] = useUserDetails();
  const [path, setPath] = React.useState("");
  const pathname = usePathname();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setPath(pathname);
    }
  }, []);

  React.useEffect(() => {
    // @ts-ignore
    if (!userDetailsPending && userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails))
      setData({
        ...data,
        user: {
          // @ts-ignore
          name: `${userDetails["firstName"]} ${userDetails["lastName"]}`,
          // @ts-ignore
          email: userDetails["phoneNumber"],
          // @ts-ignore
          avatar: userDetails["image"],
        },
      });
    }
  }, [userDetails]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Inmart.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} path={path} setPath={setPath} />
      </SidebarContent>
      <SidebarFooter>
        {userDetailsPending ? (
          <Image
            src={inlineLoadingSvg}
            alt="loading"
            className="h-4 w-fit"
            priority={true}
            height={100}
            width={100}
          />
        ) : (
          <NavUser user={data.user} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
