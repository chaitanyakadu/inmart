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
import { dealImg } from "@/public/images";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookieValue } from "@/lib/get-data";

export default function LoginPage() {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const [otp, setOtp] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [glid, setGlid] = useState<string | null>(null);
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState<string | null>(null);

  const [step, setStep] = useState<"enter-mobile" | "enter-otp">(
    "enter-mobile"
  );

  const [sending, setSending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const imiss = getCookieValue("im_iss");
    const imeshVisitor = getCookieValue("ImeshVisitor");
    const sessionToken = getCookieValue("session-token");
    if (imiss && imeshVisitor && sessionToken) {
      router.push("/profile");
    }
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = window.setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [resendTimer]);

  const normalizeMobile = (value: string) => value.replace(/\s+/g, "");

  const validateMobile = (value: string) => {
    const v = normalizeMobile(value);
    // Basic validation: accept 10-15 digits (international numbers)
    if (!/^\+?\d{10,15}$/.test(v)) {
      return "Enter a valid mobile number (digits only, optional +, 10-15 digits)";
    }
    return null;
  };

  const handleSendOtp = async () => {
    setMobileError(null);
    const err = validateMobile(mobile);
    if (err) {
      setMobileError(err);
      return;
    }
    try {
      setSending(true);
      await axios({
        url: `${BACKEND_URL}/api/connect/verify-user`,
        method: "POST",
        data: {
          phoneNumber: mobile,
        },
        withCredentials: true,
      }).then((res) => {
        const data = res.data;
        if (data.success) {
          setGlid(data.data.glid);
          setSessionKey(data.data.sessionKey);

          // Sent successfully
          setStep("enter-otp");
          setResendTimer(60); // 60 seconds cooldown
          setSending(false);
        } else {
          setMobileError(data.error || "Failed to send OTP. Try again.");
          setSending(false);
          return;
        }
      });
    } catch (e) {
      console.error(e);
      setMobileError("Network error — please try again.");
      setSending(false);
    }
  };

  // const handleResend = async () => {
  //   if (resendTimer > 0) return;
  //   await handleSendOtp();
  // };

  const handleVerifyOtp = async () => {
    setOtpError(null);
    if (!/^\d{4,8}$/.test(otp!)) {
      setOtpError("Enter the OTP digits you received.");
      return;
    }

    try {
      if (sessionKey && glid && mobile && otp) {
        await axios({
          url: `${BACKEND_URL}/api/connect/verify-otp`,
          method: "POST",
          data: {
            phoneNumber: mobile,
            glid,
            sessionKey,
            otp,
          },
          withCredentials: true,
        }).then(() => {
          router.push("/profile");
        });
      } else {
        console.warn("Check whether the credentials are valid.");
        setOtpError("OTP verification failed.");
        return;
      }
    } catch (e) {
      console.error(e);
      setOtpError("Network error — please try again.");
    }
  };

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
          <div className="w-full max-w-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Connect Account.</CardTitle>
                <CardDescription>
                  Connect account using india mart credentials.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {step === "enter-mobile" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="mobile">Mobile number</Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        placeholder="+91 9999999999"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                      />
                      {mobileError && (
                        <p className="text-sm text-destructive mt-1">
                          {mobileError}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button onClick={handleSendOtp} disabled={sending}>
                        {sending ? "Sending..." : "Send OTP"}
                      </Button>
                    </div>
                  </div>
                )}

                {step === "enter-otp" && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        OTP sent to{" "}
                        <span className="font-medium">{mobile}</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        name="otp"
                        inputMode="numeric"
                        placeholder="1234"
                        value={otp!}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/[^\d]/g, ""))
                        }
                        maxLength={8}
                      />
                      {otpError && (
                        <p className="text-sm text-destructive mt-1">
                          {otpError}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button onClick={handleVerifyOtp}>Submit</Button>
                    </div>
                  </div>
                )}
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
