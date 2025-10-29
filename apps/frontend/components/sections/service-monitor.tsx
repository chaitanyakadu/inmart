"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCookieValue } from "@/lib/get-data";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSocket } from "@/hooks/use-data";
import Stopwatch from "../composite/stopwatch";
import LeadsCount from "../composite/leads-counter";
import CustomTable from "../composite/custom-table";
import { usePathname } from "next/navigation";

export default function ServiceMonitor({
  setServiceRunning,
  state
}: any) {
  const [messages, socket, status] = useSocket();
  const pathname = usePathname();
  const oldPathname = pathname;

  useEffect(() => {
    const sessionToken = getCookieValue("session-token");
    if (socket) {
      // @ts-ignore
      socket.send(
        JSON.stringify({
          sessionToken: sessionToken,
          messageType: "monitor-logs",
        })
      );
      // @ts-ignore
      socket.send(
        JSON.stringify({
          sessionToken: sessionToken,
          messageType: "status",
        })
      );
    }

    return () => {
      if (socket) {
        // @ts-ignore
        socket.close();
      }
    };
  }, [socket]);

  useEffect(() => {
    // Handle tab close / refresh
    const handleBeforeUnload = () => {
      handleStop();
    };

    if (pathname !== oldPathname) {
      handleStop();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);

  async function handleStop() {
    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      await axios({
        url: `${BACKEND_URL}/api/service/stop`,
        method: "PUT",
        withCredentials: true,
      }).then((res) => {
        if (res.data.success) {
          setServiceRunning(false);
        }
      });
      toast.success("Service stopped successfully.");
    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong. Try again later.");
    }
  }

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle>Monitor</CardTitle>
        <CardDescription>Monitor real-time the leads purchase.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Submit button */}
        <div className="pt-2">
          <div className="flex justify-center">
            <Button
              className="w-full h-12 text-base bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 px-4 py-2 has-[>svg]:px-3 cursor-pointer"
              onClick={handleStop}
              aria-label="Create Filter"
            >
              Stop Service
            </Button>
          </div>
        </div>

        <hr className="border-t border-zinc-100 dark:border-zinc-800" />

        <div className="grid grid-cols-2 gap-6">
          {/* @ts-ignore */}
          <Stopwatch count={messages.length} state={state}/>
          {/* @ts-ignore */}
          <LeadsCount count={messages.length} />
        </div>

        <hr className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* @ts-ignore */}
        <CustomTable userHistory={messages} />
      </CardContent>
    </Card>
  );
}
