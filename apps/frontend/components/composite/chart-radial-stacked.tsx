"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useUserCredit } from "@/hooks/use-data";
import Image from "next/image";
import { spinningDotsSvg } from "@/public/images";
import { useEffect, useState } from "react";

export function ChartRadialStacked() {
  const [userCredits, userCreditsPending] = useUserCredit();
  const [chartData, setChartData] = useState([
    { month: "Weekly", desktop: 42, mobile: 8 },
  ]);
  const chartConfig = {
    desktop: {
      label: "Left",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Used",
      color: "var(--chart-2)",
    },
  };

  const totalVisitors = chartData[0]!.desktop + chartData[0]!.mobile;

  useEffect(() => {
    if (userCredits) {
      setChartData([
        {
          month: "Weekly",
          // @ts-ignore
          desktop: Number(userCredits["weeklyExpAvai"]),
          mobile:
            // @ts-ignore
            Number(userCredits["weeklyExpAlloted"]) -
            // @ts-ignore
            Number(userCredits["weeklyExpAvai"]),
        },
      ]);
    }
  }, [userCredits]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Balance</CardTitle>
        <CardDescription>Weekly Leads</CardDescription>
      </CardHeader>
      <CardContent
        className={`flex flex-1 items-center ${userCreditsPending && "justify-center"} pb-0`}
      >
        {userCreditsPending ? (
          <Image
            src={spinningDotsSvg}
            alt="loading"
            className="h-8"
            priority={true}
            height={100}
            width={100}
          />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={80}
              outerRadius={130}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Total Leads
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="desktop"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-desktop)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="mobile"
                fill="var(--color-mobile)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
