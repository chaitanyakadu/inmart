"use client";

import FilterCreate from "@/components/sections/filter-create";
import FilterUpdate from "@/components/sections/filter-update";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fieldDataReducer } from "@/hooks/reducer";
import { useUserFilters } from "@/hooks/use-data";
import { TabsContent } from "@radix-ui/react-tabs";
import { FilterDataState } from "@repo/types/web";
import { useEffect, useReducer, useState } from "react";
import { Toaster } from "sonner";

export default function Page() {
  const [state, dispatch] = useReducer(fieldDataReducer, FilterDataState);
  const [titleArr, setTitleArr] = useState<Array<string>>([]);
  const [userFilters, userFilterPending] = useUserFilters();

  useEffect(() => {
    if (!userFilterPending) {
      userFilters.map((v: any) => {
        setTitleArr((d: any) => [...d, v.title]);
      });
    }
  }, [userFilters]);
  return (
    <section className="p-6">
      <div className="mx-auto max-w-[1100px]">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="update" disabled={titleArr.length === 0}>
              Update
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <FilterCreate state={state} dispatch={dispatch} />
          </TabsContent>
          <TabsContent value="update">
            <FilterUpdate
              state={state}
              dispatch={dispatch}
              titleArr={titleArr}
              userFilters={userFilters}
              userFilterPending={userFilterPending}
            />
          </TabsContent>
        </Tabs>

        {/* Toaster: global placement (bottom-right). */}
        <Toaster position="bottom-right" richColors />
      </div>
    </section>
  );
}
