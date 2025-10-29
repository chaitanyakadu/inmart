"use client";

import { GalleryVerticalEnd } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { dealImg, gmailSvg } from "@/public/images";
import axios from "axios";
import { CustomError, IResult } from "@repo/types/backend";
import { toast } from "sonner";
import { useEffect } from "react";
import { getCookieValue } from "@/lib/get-data";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const sessionToken = getCookieValue("session-token");
    if (sessionToken) {
      router.push("/profile");
    }
  }, []);

  async function handleBtnClick() {
    await axios({
      url: `${BACKEND_URL}/auth/login`,
      method: "GET",
      withCredentials: true,
    })
      .then((res) => {
        const data: IResult = res.data;

        if (!data.redirectUrl) {
          toast.error("Server error! try again later.");
          throw new CustomError(
            "The backend did not return valid format.",
            "Missing parameters!"
          );
        }

        window.location.href = data.redirectUrl;
      })
      .catch(() => {
        toast.error("Unknown error occured, kindly try again.");
      });
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <p>Inmart.</p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Sign in</CardTitle>
                <CardDescription>
                  Sign in with your Google account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleBtnClick}
                    className="w-full justify-center h-fit cursor-pointer"
                    aria-label="Sign in with Google"
                  >
                    <span className="flex items-center gap-3 py-1">
                      {/* Replace with your Icon component or inline svg */}
                      <Image
                        src={gmailSvg}
                        alt="Gmail Icon"
                        height={100}
                        width={100}
                        className="h-6 w-fit"
                      />
                      <span>Continue with Google</span>
                    </span>
                  </Button>

                  <Separator className="my-4" />

                  <div className="text-sm text-center text-muted-foreground">
                    By continuing you confirm that you agree with our Terms and
                    Privacy.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={dealImg}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
          height={100}
          width={100}
          quality={100}
          unoptimized
        />
      </div>
    </div>
  );
}
