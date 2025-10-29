"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useUserHistory } from "@/hooks/use-data";
import { UserHistory } from "@repo/types/socket";
import { useEffect, useState } from "react";
import { spinningDotsSvg } from "@/public/images";
import Image from "next/image";

export const description = "A pie chart with a label";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

async function sortUserHistory(userHistory: Array<UserHistory>) {
  const userHistoryMap = new Map<string, number>();
  userHistory.map((v) => {
    if (userHistoryMap.get(v.customerCountry!)) {
      userHistoryMap.set(
        v.customerCountry!,
        userHistoryMap.get(v.customerCountry!)! + 1
      );
    } else {
      userHistoryMap.set(v.customerCountry!, 1);
    }
  });
  const resultArr: Array<{ country: string; count: number }> = [];
  let runLoop = true;
  let loop = 0;

  while (runLoop) {
    let largest = 0;
    let key = null;
    userHistoryMap.forEach((v, k) => {
      if (largest < v) {
        largest = v;
        key = k;
      }
    });

    // @ts-ignore
    resultArr.push({ country: key, count: largest });
    // @ts-ignore
    userHistoryMap.delete(key);

    loop++;

    if (loop >= userHistoryMap.size || resultArr.length > 4) {
      runLoop = false;
    }
  }

  return resultArr;
}

export function ChartPieLabel({
  userHistory,
  userHistoryPending,
}: {
  userHistory: Array<UserHistory>;
  userHistoryPending: boolean;
}) {
  const [chartData, setChartData] = useState<any>(null);
  const [insufficientData, setInsufficientData] = useState(true);

  useEffect(() => {
    (async () => {
      if (!userHistoryPending) {
        // @ts-ignore
        const result = await sortUserHistory(userHistory);

        if (result.length >= 3) {
          setChartData([
            {
              browser: result[0]?.country!,
              visitors: result[0]?.count!,
              fill: "var(--color-chrome)",
            },
            {
              browser: result[1]?.country!,
              visitors: result[1]?.count!,
              fill: "var(--color-safari)",
            },
            {
              browser: result[2]?.country!,
              visitors: result[2]?.count!,
              fill: "var(--color-firefox)",
            }
          ]);

          setInsufficientData(false);
        }
      }
    })();
  }, [userHistory]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Leads Handled</CardTitle>
        <CardDescription>Country wise</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className={`[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0 ${!chartData ? "flex flex-col justify-center items-center" : null}`}
        >
          {userHistoryPending ? (
            <div className="h-full w-full text-sm flex justify-center items-center">
              <Image
                src={spinningDotsSvg}
                alt="loading"
                className="h-8 my-auto"
                priority={true}
                height={100}
                width={100}
              />
            </div>
          ) : insufficientData ? (
            <p className="h-full w-full text-sm flex justify-center items-center">
              Insufficient Data
            </p>
          ) : (
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="visitors"
                label
                nameKey="browser"
              />
            </PieChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
