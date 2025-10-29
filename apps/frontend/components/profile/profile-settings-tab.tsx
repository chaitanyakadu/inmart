"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import axios from "axios";

export function SettingsTab() {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  // const { theme, setTheme, resolvedTheme } = useTheme();
  // const [checked, setChecked] = useState(false);

  async function onLogout() {
    try {
      localStorage.clear();
      await axios({
        url: `${BACKEND_URL}/auth/logout`,
        method: "PUT",
        withCredentials: true,
      });
      window.location.href = "/auth/login";
    } catch (error) {
      console.warn(error);
    }
  }

  async function onDelete() {
    try {
      await axios({
        url: `${BACKEND_URL}/auth/delete`,
        method: "DELETE",
        withCredentials: true,
      });
      localStorage.clear();
      window.location.href = "/auth/login";
    } catch (error) {
      console.warn(error);
    }
  }

  // useEffect(() => {
  //   setChecked((resolvedTheme ?? theme) === "dark");
  // }, [theme, resolvedTheme]);

  // function onToggle(next: boolean) {
  //   setChecked(next);
  //   setTheme(next ? "dark" : "light");
  // }

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Adjust your settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="theme">Dark mode</Label>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Toggle the site appearance for your account.
              </p>
            </div>
            <Switch id="theme" checked={checked} onCheckedChange={onToggle} />
          </div> */}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Log out</Label>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                End your current session on this device.
              </p>
            </div>
            <Button variant="secondary" onClick={onLogout} className="cursor-pointer">
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200/60 dark:border-red-900/60">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-400">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-600/90 dark:text-red-400/90">
            Deleting your account is permanent and cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Delete account</Label>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              This will remove your profile, sessions, and any associated data.
            </p>
          </div>

          {/* Confirm dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="cursor-pointer">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-red-200/60 dark:border-red-900/60">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers. Type{" "}
                  <span className="font-semibold">DELETE</span> to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {/* Inline confirmation input to reduce accidental deletes */}
              <ConfirmDeleteInput onConfirm={() => onDelete?.()} />

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {/* The destructive action is handled inside ConfirmDeleteInput to ensure text matches */}
                {/* We still render a disabled-looking placeholder button for layout consistency */}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Small helper that requires the user to type "DELETE" before enabling the final action.
 * Calls onConfirm() and closes the dialog via programmatic click on the Cancel (workaround),
 * or you can move onConfirm to a server action directly.
 */
function ConfirmDeleteInput({ onConfirm }: { onConfirm: () => void }) {
  const [value, setValue] = useState("");

  const enabled = value.trim().toUpperCase() === "DELETE";

  return (
    <div className="space-y-3">
      <input
        className="w-full rounded-md border border-zinc-300 bg-transparent p-2 text-sm outline-none ring-offset-background placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:focus-visible:ring-zinc-50"
        placeholder='Type "DELETE" to confirm'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="destructive"
          disabled={!enabled}
          className="cursor-pointer"
          onClick={() => {
            if (!enabled) return;
            onConfirm();
            // Close the dialog by clicking the "Cancel" button programmatically (shadcn AlertDialog helper)
            const btn =
              document.querySelector<HTMLButtonElement>(
                "[data-radix-collection-item]"
              ) ?? // Cancel btn
              document.querySelector<HTMLButtonElement>(
                "[data-state='open'] button:has(span:contains('Cancel'))"
              );
            btn?.click();
          }}
        >
          Permanently delete
        </Button>
      </div>
    </div>
  );
}
