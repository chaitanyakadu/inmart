"use client";

import ServiceFilter from "@/components/sections/service-filters";
import ServiceMonitor from "@/components/sections/service-monitor";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fieldDataReducer } from "@/hooks/reducer";
import { TabsContent } from "@radix-ui/react-tabs";
import { FilterDataState } from "@repo/types/web";
import { useEffect, useReducer, useState } from "react";
import { Toaster } from "sonner";

export default function Page() {
  const [serviceRunning, setServiceRunning] = useState<boolean>(false);
  const [state, dispatch] = useReducer(fieldDataReducer, FilterDataState);

  useEffect(() => {
    if (serviceRunning) {
      localStorage.setItem("serviceRunning", "true");
    } else {
      localStorage.removeItem("serviceRunning");
    }
  }, [serviceRunning]);

  return (
    <section className="p-6">
      <div className="mx-auto max-w-[1100px]">
        <Tabs className="w-full" value={serviceRunning ? "service" : "filter"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="filter">Filter</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
          </TabsList>

          <TabsContent value="filter">
            <ServiceFilter
              setServiceRunning={setServiceRunning}
              state={state}
              dispatch={dispatch}
            />
          </TabsContent>
          <TabsContent value="service">
            <ServiceMonitor
              setServiceRunning={setServiceRunning}
              state={state}
            />
          </TabsContent>
        </Tabs>

        {/* Toaster: global placement (bottom-right). */}
        <Toaster position="bottom-right" richColors />
      </div>
    </section>
  );
}
