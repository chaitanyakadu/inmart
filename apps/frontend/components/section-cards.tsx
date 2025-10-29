import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartRadialStacked } from "./composite/chart-radial-stacked";
import { ChartPieLabel } from "./composite/chart-pie-label";
import { UserHistory } from "@repo/types/socket";
import Image from "next/image";
import { inlineLoadingSvg } from "@/public/images";
import { CustomProfileCard } from "./composite/custom-profile-card";

export function SectionCards({
  userHistory,
  userHistoryPending,
}: {
  userHistory: Array<UserHistory>;
  userHistoryPending: boolean;
}) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <ChartRadialStacked />
      <ChartPieLabel
        userHistory={userHistory}
        userHistoryPending={userHistoryPending}
      />
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Leads Handled</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {userHistoryPending ? (
              <Image
                src={inlineLoadingSvg}
                alt="loading"
                className="h-8 my-auto"
                priority={true}
                height={100}
                width={100}
              />
            ) : (
              userHistory.length
            )}
          </CardTitle>
        </CardHeader>
      </Card>
      <CustomProfileCard />
    </div>
  );
}
