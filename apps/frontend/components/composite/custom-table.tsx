"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UserHistory } from "@repo/types/socket";

export default function CustomTable({
  userHistory,
}: {
  userHistory: Array<UserHistory>;
}) {
  const [userHistoryArr, setUserHistoryArr] =
    useState<Array<UserHistory>>(userHistory);
  const PAGE_SIZE = 10;

  useEffect(() => {
    setUserHistoryArr([...userHistory].reverse());
  }, [userHistory]);

  const [page, setPage] = useState(1);

  const total = userHistoryArr?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Clamp page if data changes
  const currentPage = Math.min(page, totalPages);

  const { rows, start, end } = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    return {
      rows: (userHistoryArr ?? []).slice(startIdx, endIdx),
      start: startIdx + 1,
      end: Math.min(endIdx, total),
    };
  }, [currentPage, userHistoryArr, total]);

  if (!userHistoryArr || userHistoryArr.length === 0) {
    return (
      <div className="mx-4 lg:mx-6 flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-10 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        No history yet.
      </div>
    );
  }

  return (
    <div className="mx-4 lg:mx-6 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Table */}
      <Table>
        <TableHeader className="bg-zinc-50/60 dark:bg-zinc-900/40">
          <TableRow className="bg-muted/50 border-zinc-200 dark:border-zinc-800">
            <TableHead className="w-[28%] text-zinc-600 dark:text-zinc-300">
              Customer
            </TableHead>
            <TableHead className="w-[22%] text-zinc-600 dark:text-zinc-300">
              Medicine
            </TableHead>
            <TableHead className="w-[16%] text-zinc-600 dark:text-zinc-300">
              Category
            </TableHead>
            <TableHead className="w-[14%] text-zinc-600 dark:text-zinc-300">
              Status
            </TableHead>
            <TableHead className="w-[16%] text-zinc-600 dark:text-zinc-300">
              Created
            </TableHead>
            <TableHead className="w-[4%] text-right text-zinc-600 dark:text-zinc-300">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, idx) => {
            const name = row.customerName || "—";
            const country = row.customerCountry || "";
            const medicine = row.medicineName || "—";
            const category = row.medicineCategory || "—";
            const created = formatDate(row.createdAt);

            return (
              <TableRow
                key={`${Math.random()}`}
                className="border-zinc-200 hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                      {name}
                    </span>
                    <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                      {country || "—"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="align-middle">
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {medicine}
                  </span>
                </TableCell>

                <TableCell className="align-middle">{category}</TableCell>

                <TableCell className="align-middle">
                  <StatusBadge value={row.status} />
                </TableCell>

                <TableCell className="align-middle text-zinc-600 dark:text-zinc-300">
                  {created}
                </TableCell>

                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="View details"
                        className="text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-zinc-900 dark:text-zinc-100">
                          Details: {medicine}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                          A quick view of this request.
                        </DialogDescription>
                      </DialogHeader>

                      <p className="text-sm text-zinc-900 dark:text-zinc-100">
                        {row.details?.trim() ? row.details : "—"}
                      </p>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Footer: results summary + pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-200 px-4 mx-2 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 md:flex-row md:px-4">
        <div className="order-2 md:order-1">
          Showing{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {start}
          </span>
          –
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {end}
          </span>{" "}
          of{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {total}
          </span>
        </div>

        <Pagination className="order-1 md:order-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-label="Previous page"
                onClick={(e: any) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {renderPageLinks({ currentPage, totalPages, onGo: setPage })}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-label="Next page"
                onClick={(e: any) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function renderPageLinks({
  currentPage,
  totalPages,
  onGo,
}: {
  currentPage: number;
  totalPages: number;
  onGo: (n: number) => void;
}) {
  const pages = getCompactPages(currentPage, totalPages);
  return pages.map((p, i) => {
    if (p === "…") {
      return (
        <PaginationItem key={`ellipsis-${i}`}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    const n = Number(p);
    const active = n === currentPage;
    return (
      <PaginationItem key={n}>
        <PaginationLink
          href="#"
          aria-current={active ? "page" : undefined}
          isActive={active}
          onClick={(e: any) => {
            e.preventDefault();
            onGo(n);
          }}
        >
          {n}
        </PaginationLink>
      </PaginationItem>
    );
  });
}

function getCompactPages(current: number, total: number): (number | "…")[] {
  // Always show: 1, last, current, ±1; add ellipses where needed
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const normalized = [...pages]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const out: (number | "…")[] = [];
  for (let i = 0; i < normalized.length; i++) {
    const n = normalized[i]!;
    const prev = normalized[i - 1];
    if (i > 0 && prev !== undefined && n - prev > 1) out.push("…");
    out.push(n);
  }
  return out;
}

function formatDate(input?: string) {
  if (!input) return "—";
  const date = new Date(input);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StatusBadge({ value }: { value?: string }) {
  const v = (value || "unknown").toLowerCase();
  const map: Record<string, string> = {
    ["purchased and messaged"]:
      "bg-zinc-100 text-zinc-900 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-blue-800",
    ["purchased"]:
      "bg-zinc-100 text-zinc-900 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-purple-800",
    ["messaged"]:
      "bg-zinc-100 text-zinc-900 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-green-800",
    ["interested"]:
      "bg-zinc-50 text-zinc-700 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-yellow-800",
  };
  const cls =
    map[v] ??
    "bg-zinc-100 text-zinc-900 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-800";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${cls}`}
    >
      {value || "Unknown"}
    </span>
  );
}
