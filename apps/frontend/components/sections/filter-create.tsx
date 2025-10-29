"use client";

import {
  BoolAndPointsInput,
  DropdownInput,
  ListInput,
  TextInputWithLabel,
} from "@/components/composite/filters-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserCookie } from "@/lib/get-data";
import { UserDetails } from "@repo/types/web";
import axios from "axios";
import { toast } from "sonner";

export default function FilterCreate({ state, dispatch }: any) {
  async function handleSubmit() {
    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const userDetails: UserDetails = JSON.parse(
        localStorage.getItem("userDetails")!
      );
      const cookie = getUserCookie();

      if (
        state.keyValue.email.value &&
        state.keyValue.fullName.value &&
        state.keyValue.companyName.value &&
        state.keyValue.minPointsForPurchase.value
      ) {
        // @ts-ignore
        const data: FilterData = {
          whatsappActive: state.boolAndPoints.whatsappActive,
          mobVerified: state.boolAndPoints.mobVerified,
          emailVerified: state.boolAndPoints.emailVerified,
          buyerReply: state.boolAndPoints.buyerReply,
          buyerRequirement: state.boolAndPoints.buyerRequirement,
          buyerCalls: state.boolAndPoints.buyerCalls,
          sec: state.boolAndPoints.sec,

          allowCountries: state.list.allowCountries.value || [],
          allowCategories: state.list.allowCategories?.value || [],
          restrictMedicines: state.list.restrictMedicines.value || [],
          allowOnlyMedicines: state.list.allowOnlyMedicines.value || [],

          triggerOn: state.enumType.triggerOn.value,
          triggerType: state.enumType.triggerType.value,

          totalMessages: state.keyValue.totalMessages?.value || 1,
          minPointsForPurchase: state.keyValue.minPointsForPurchase.value,
          email: state.keyValue.email.value,
          fullName: state.keyValue.fullName.value,
          companyName: state.keyValue.companyName.value,

          title: state.metaData.title.value,

          cookies: cookie,
          aiInstructions: "",
          glusrId: userDetails.glid,
          ipAddress: "",
          mobNumber: userDetails.phoneNumber,
          userId: "",
        };
        await axios({
          url: `${BACKEND_URL}/api/filters`,
          method: "POST",
          data: data,
          withCredentials: true,
        }).then((res) => {
          if (res.data.success) {
            toast.success("Filter created successfully.");
          } else {
            toast.error(res.data.info);
          }
        });
      } else {
        toast.error("Kindly enter all required fields.");
      }
    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong. Try again later.");
    }
  }

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle>Create filters</CardTitle>
        <CardDescription>
          Create custom filters to optimize the leads purchase.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* --- MetaData / Others section --- */}
        <section aria-labelledby="meta-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 id="meta-heading" className="text-sm font-semibold">
              Metadata
            </h3>
            <p className="text-xs text-muted-foreground">
              {Object.keys(state.metaData).length} field
              {Object.keys(state.metaData).length !== 1 && "s"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {
              <div className="w-[480px] mx-auto">
                {/* @ts-ignore */}
                <TextInputWithLabel
                  // @ts-ignore
                  param={Object.values(state.metaData)[0]}
                  dispatch={dispatch}
                  type={"metaData"}
                />
              </div>
            }
          </div>
        </section>

        <hr className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* --- Key-value section --- */}
        <section aria-labelledby="kv-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 id="kv-heading" className="text-sm font-semibold">
              Key-Value <span className="text-red-900">*</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {Object.keys(state.keyValue).length} field
              {Object.keys(state.keyValue).length !== 1 && "s"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {Object.values(state.keyValue).map((entries: any) => (
              <div key={entries.id} className="w-[480px] mx-auto">
                {/* @ts-ignore */}
                <TextInputWithLabel
                  // @ts-ignore
                  param={entries}
                  dispatch={dispatch}
                  type={"keyValue"}
                />
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* --- Bool & Points section --- */}
        <section aria-labelledby="bool-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 id="bool-heading" className="text-sm font-semibold">
              Points System
            </h3>
            <p className="text-xs text-muted-foreground">
              {Object.keys(state.boolAndPoints).length} field
              {Object.keys(state.boolAndPoints).length !== 1 && "s"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {Object.values(state.boolAndPoints).map((entries: any) => (
              <div key={entries.id} className="w-[480px] mx-auto">
                {/* @ts-ignore */}
                <BoolAndPointsInput
                  // @ts-ignore
                  param={entries}
                  dispatch={dispatch}
                />
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* --- List section --- */}
        <section aria-labelledby="list-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 id="list-heading" className="text-sm font-semibold">
              List
            </h3>
            <p className="text-xs text-muted-foreground">
              {Object.keys(state.list).length} field
              {Object.keys(state.list).length !== 1 && "s"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {Object.values(state.list).map((entries: any) => (
              <div key={entries.id} className="w-[480px] mx-auto">
                {/* @ts-ignore */}
                <ListInput
                  // @ts-ignore
                  param={entries}
                  dispatch={dispatch}
                />
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* --- Enum / Dropdown section --- */}
        <section aria-labelledby="enum-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 id="enum-heading" className="text-sm font-semibold">
              Trigger Property
            </h3>
            <p className="text-xs text-muted-foreground">
              {Object.keys(state.enumType).length} field
              {Object.keys(state.enumType).length !== 1 && "s"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {Object.values(state.enumType).map((entries: any) => (
              <div key={entries.id} className="w-[480px] mx-auto">
                {/* @ts-ignore */}
                <DropdownInput
                  // @ts-ignore
                  param={entries}
                  dispatch={dispatch}
                />
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* Submit button */}
        <div className="pt-2">
          <div className="flex justify-center">
            <Button
              className="w-full h-12 text-base cursor-pointer"
              onClick={handleSubmit}
              aria-label="Create Filter"
            >
              Create Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
