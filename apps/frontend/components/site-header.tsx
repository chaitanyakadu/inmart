"use client";

import { useServiceStatus } from "@/hooks/use-data";
import { inlineLoadingSvg } from "@/public/images";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { getCookieValue } from "@/lib/get-data";

export function SiteHeader() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceStatus, serviceStatusLoading] = useServiceStatus();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const imiss = getCookieValue("im_iss");
    const imeshVisitor = getCookieValue("ImeshVisitor");
    const sessionToken = getCookieValue("session-token");
    if (!imiss || !imeshVisitor || !sessionToken) {
      router.push("/auth/login");
      toast.warning("Kindly login!");
    }
    switch (pathname) {
      case "/dashboard": {
        setCurrentPage("Dashboard");
        setLoading(false);
        break;
      }
      case "/service": {
        setCurrentPage("Service");
        setLoading(false);
        break;
      }
      case "/filters": {
        setCurrentPage("Filters");
        setLoading(false);
        break;
      }
      case "/profile": {
        setCurrentPage("Profile");
        setLoading(false);
        break;
      }
      case "/settings": {
        setCurrentPage("Settings");
        setLoading(false);
        break;
      }
      default: {
        setCurrentPage("Dashboard");
        setLoading(false);
        break;
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (serviceStatus) {
      router.push("/service");
      toast.message("The service is running!");
    }
  }, [serviceStatus]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium">
          {loading ? (
            <Image
              src={inlineLoadingSvg}
              alt="loading"
              className="h-4 w-fit"
              priority={true}
              height={100}
              width={100}
            />
          ) : (
            currentPage
          )}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {serviceStatusLoading ? (
            <Image
              src={inlineLoadingSvg}
              alt="loading"
              className="h-4 w-fit"
              priority={true}
              height={100}
              width={100}
            />
          ) : serviceStatus ? (
            <p className="text-green-400">Active</p>
          ) : (
            <p className="text-red-400">Inactive</p>
          )}
        </div>
      </div>
      <Toaster />
    </header>
  );
}
