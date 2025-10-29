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
import { useUserFilters } from "@/hooks/use-data";
import { getCookieValue, getUserCookie } from "@/lib/get-data";
import { spinningDotsSvg } from "@/public/images";
import {  UserDetails } from "@repo/types/web";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ServiceFilter({
  setServiceRunning,
  state,
  dispatch,
}: any) {
  const [userFilters, userFilterPending] = useUserFilters();
  const [titleArr, setTitleArr] = useState<Array<string>>([]);
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const data = {
    id: "filter-title",
    label: "Filter Title",
    placeholder: "Title for the custom filter.",
    options: titleArr,
    value: currentValue,
  };

  useEffect(() => {
    if (titleArr[0]) {
      setCurrentValue(titleArr[0]);
      const newState = userFilters.find((info: any) => {
        if (info.title === titleArr[0]) {
          return true;
        }
      });
      dispatch({
        type: "update-state",
        // id: param.id,
        value: newState,
      });
    }
  }, [titleArr]);

  useEffect(() => {
    setTitleArr([]);
    if (!userFilterPending) {
      userFilters.map((v: any) => {
        setTitleArr((d) => [...d, v.title]);
      });
    }
  }, [userFilters]);

  async function handleService() {
    try {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const sessionToken = getCookieValue("session-token")!;
      const userDetails: UserDetails = JSON.parse(
        localStorage.getItem("userDetails")!
      );
      const cookie = getUserCookie();

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
        maxLeads: state.metaData.maxLeads.value,

        cookies: cookie,
        aiInstructions: "",
        glusrId: userDetails.glid,
        ipAddress: "",
        mobNumber: userDetails.phoneNumber,
        userId: "",
        sessionToken,
      };

      await axios({
        url: `${BACKEND_URL}/api/service/start`,
        method: "PUT",
        withCredentials: true,
        data,
      }).then((res) => {
        if (res.data.success) {
          setServiceRunning(true);
          toast.success("Service started.");
        }
      });
    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong. Try again later.");
    }
  }

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle>Service filters</CardTitle>
        <CardDescription>
          Select filter to optimize the leads purchase.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* --- Dropdown section --- */}
        <section aria-labelledby="dropdown-heading" className="space-y-3">
          {userFilterPending && titleArr ? (
            <Image
              src={spinningDotsSvg}
              alt="loading"
              className="h-4 w-fit"
              priority={true}
              height={100}
              width={100}
            />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 id="dropdown-heading" className="text-sm font-semibold">
                  Dropdown Fields
                </h3>
                <p className="text-xs text-muted-foreground">1 field</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="w-[480px] mx-auto">
                  {/* @ts-ignore */}
                  <DropdownInput
                    // @ts-ignore
                    param={data}
                    dispatch={dispatch}
                    type={"metaData"}
                    data={userFilters}
                    currentValue={currentValue}
                    setCurrentValue={setCurrentValue}
                    disabled={false}
                  />
                </div>
                {(() => {
                  const param = state.metaData.maxLeads;
                  if (param) {
                    return (
                      <div className="w-[480px] mx-auto">
                        {/* @ts-ignore */}
                        <TextInputWithLabel
                          // @ts-ignore
                          param={param}
                          dispatch={dispatch}
                          type={"metaData"}
                          disabled={false}
                        />
                      </div>
                    );
                  } else {
                    return null;
                  }
                })()}
              </div>
            </>
          )}
        </section>

        <hr className="border-t border-zinc-100 dark:border-zinc-800" />

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
            <div className="w-[480px] mx-auto">
              {/* @ts-ignore */}
              <TextInputWithLabel
                // @ts-ignore
                param={Object.values(state.metaData)[0]}
                dispatch={dispatch}
                type={"metaData"}
                disabled={true}
              />
            </div>
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
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
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
                  type="any"
                  disabled={true}
                />
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* Submit button */}
        <div className="pt-2">
          <Button
            className="h-12 w-full text-base bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            onClick={handleService}
            aria-label="Create Filter"
            disabled={!currentValue}
          >
            Start Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
