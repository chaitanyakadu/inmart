"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getUserDetails } from "@/lib/get-data";
import Image from "next/image";
import { spinningDotsSvg } from "@/public/images";
import { UserDetails } from "@repo/types/web";

export function ProfileCard() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const details = localStorage.getItem("userDetails");

        if (details) {
          setUserDetails(JSON.parse(details));
        } else {
          const result = await getUserDetails();

          if (!result.success || !result.data) {
            throw Error("Error occured while fetching User data!");
          }

          setUserDetails(result.data);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      {!userDetails ? (
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
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={userDetails.image}
                alt={`${userDetails.firstName} ${userDetails.lastName}`}
              />
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {userDetails.firstName} {userDetails.lastName}
              </CardTitle>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {userDetails.companyName}
              </p>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3 pt-4">
            <Field label="Country" value={userDetails.country} />
            <Field label="Phone" value={userDetails.phoneNumber} />
          </CardContent>
        </>
      )}
    </Card>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}
