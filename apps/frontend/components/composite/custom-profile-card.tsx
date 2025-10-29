"use client";

import Image from "next/image";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { UserDetails } from "@repo/types/web";
import { getUserDetails } from "@/lib/get-data";
import { spinningDotsSvg } from "@/public/images";

export function CustomProfileCard() {
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
    <Card className="@container/card flex flex-col gap-2 justify-center items-center">
      {!userDetails ? (
        <Image
          src={spinningDotsSvg}
          alt="loading"
          className="h-8 my-auto"
          priority={true}
          height={100}
          width={100}
        />
      ) : (
        <>
          <Image
            src={userDetails?.image}
            alt="Profile picture"
            className="h-24 w-24 rounded-full mb-2"
            height={100}
            width={100}
            quality={100}
          />
          <p className="text-base">{userDetails.companyName}</p>
          <p className="text-neutral-400">{userDetails.country}</p>
        </>
      )}
    </Card>
  );
}
