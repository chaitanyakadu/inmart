"use client";

import { ProfileCard } from "@/components/profile/profile-card";
import { DetailsTab } from "@/components/profile/profile-details-tab";
import { SettingsTab } from "@/components/profile/profile-settings-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserData, useUserSession } from "@/hooks/use-data";
import { spinningDotsSvg } from "@/public/images";
import Image from "next/image";

export default function ProfilePage() {
  const [userData, userDataPending] = useUserData();
  const [userSessions, userSessionsPending] = useUserSession();

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Profile Card (read-only) */}
        <div className="lg:col-span-1">
          <ProfileCard />
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue={"details"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details" id="details">
              {userDataPending || userSessionsPending ? (
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
                <DetailsTab value={userData} userSessions={userSessions} />
              )}
            </TabsContent>

            <TabsContent value="settings" id="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

{
  /* <Separator /> */
}
