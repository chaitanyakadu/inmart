"use client";

import { SectionCards } from "@/components/section-cards";
import { useUserHistory } from "@/hooks/use-data";
import Image from "next/image";
import { spinningDotsSvg } from "@/public/images";
import CustomTable from "@/components/composite/custom-table";

export default function Page() {
  const [userHistory, userHistoryPending] = useUserHistory();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards
            // @ts-ignore
            userHistory={userHistory}
            // @ts-ignore
            userHistoryPending={userHistoryPending}
          />
          {userHistoryPending ? (
            <Image
              src={spinningDotsSvg}
              alt="loading"
              className="h-4 w-fit"
              priority={true}
              height={100}
              width={100}
            />
          ) : (
            // @ts-ignore
            <CustomTable userHistory={[...userHistory].reverse()} />
          )}
        </div>
      </div>
    </div>
  );
}
