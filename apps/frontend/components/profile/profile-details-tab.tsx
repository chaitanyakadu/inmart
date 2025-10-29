"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { ProfileGetUserData } from "@repo/types/backend";
import axios from "axios";
import { toast, Toaster } from "sonner";

export function DetailsTab({
  value,
  userSessions,
}: {
  value: ProfileGetUserData;
  userSessions: any;
}) {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  // local state for editable fields (email stays read-only)
  const [form, setForm] = useState({
    firstName: value["First Name"] ?? "",
    lastName: value["Last Name"] ?? "",
    contact: value["Contact"] ?? "",
  });

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSave() {
    try {
      const data: ProfileGetUserData = {
        "First Name": form.firstName,
        "Last Name": form.lastName,
        Email: value.Email,
        Contact: form.contact,
      };
      await axios({
        url: `${BACKEND_URL}/api/profile`,
        method: "PUT",
        withCredentials: true,
        data: data,
      });
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again later.");
    }
  }
  return (
    <div className="space-y-6">
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            Update your basic information. Email and contact cannot be changed.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              placeholder="First name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              placeholder="Last name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              name="contact"
              value={form.contact}
              onChange={onChange}
              readOnly
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email (read-only)</Label>
            <Input
              id="email"
              value={value["Email"]}
              readOnly
              className="bg-zinc-100 dark:bg-zinc-900"
            />
          </div>
          <div className="md:col-span-2">
            <Button className="cursor-pointer" onClick={onSave}>
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-200 dark:border-zinc-800 gap-2">
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>
            Recent devices logged into your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-zinc-800">
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Signed In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userSessions.map((s: any, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{s.device}</TableCell>
                  <TableCell>{formatDate(s.createdAt)}</TableCell>
                </TableRow>
              ))}
              {userSessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-zinc-500">
                    No sessions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
