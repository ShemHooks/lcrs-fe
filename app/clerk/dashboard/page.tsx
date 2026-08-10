"use client";

import Link from "next/link";

import {
  AlertCircle,
  Baby,
  FileText,
  Heart,
  Loader2,
  RefreshCcw,
  Search,
  Skull,
} from "lucide-react";

import DashboardCard from "@/components/reusable/DashboardCard";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useDashboardStats } from "@/server/hooks/dashboardHooks";

export default function ClerkDashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardStats();

  /**
   * Loading
   */
  if (isLoading) {
    return <DashboardLoading />;
  }

  /**
   * Error
   */
  if (isError) {
    return (
      <DashboardError
        message={
          error instanceof Error
            ? error.message
            : "Unable to load dashboard information."
        }
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const dashboard = data?.dashboard;

  const birthStats = dashboard?.birthStats;
  const marriageStats = dashboard?.marriageStats;
  const deathStats = dashboard?.deathStats;

  console.log("birth stats", birthStats);

  const cards = [
    {
      title: "Birth Records",

      value: birthStats?.total ?? 0,

      description: `Male: ${
        birthStats?.male ?? 0
      } | Female: ${birthStats?.female ?? 0}`,

      icon: <Baby className="h-5 w-5" />,

      valueClassName: "text-blue-600",
    },

    {
      title: "Marriage Records",

      value: marriageStats?.total ?? 0,

      description: "Total marriages registered",

      icon: <Heart className="h-5 w-5" />,

      valueClassName: "text-pink-600",
    },

    {
      title: "Death Records",

      value: deathStats?.total ?? 0,

      description: `Male: ${
        deathStats?.male ?? 0
      } | Female: ${deathStats?.female ?? 0}`,

      icon: <Skull className="h-5 w-5" />,

      valueClassName: "text-slate-600",
    },

    {
      title: "Recent Activity",

      value: dashboard?.recentTransactions?.length ?? 0,

      description: "Recent transactions",

      icon: <FileText className="h-5 w-5" />,

      valueClassName: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#92191d]">
            Local Civil Registry
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Clerk Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor civil registration activity and quickly access common clerk
            operations.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isFetching}
          onClick={() => refetch()}
        >
          {isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            valueClassName={card.valueClassName}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-5">
        <div className="mb-4">
          <h2 className="font-semibold text-slate-900">Quick Actions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Start a registration or locate an existing civil registry record.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="bg-[#92191d] text-white hover:bg-[#761216]"
          >
            <Link href="/clerk/registration/birth">
              <Baby className="mr-2 h-4 w-4" />
              Register Birth
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/clerk/registration/marriage">
              <Heart className="mr-2 h-4 w-4" />
              Register Marriage
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/clerk/registration/death">
              <Skull className="mr-2 h-4 w-4" />
              Register Death
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/clerk/records">
              <Search className="mr-2 h-4 w-4" />
              Search Records
            </Link>
          </Button>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-5">
        <div className="mb-5">
          <h2 className="font-semibold text-slate-900">Recent Transactions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest activity recorded by the civil registry system.
          </p>
        </div>

        {!dashboard?.recentTransactions?.length ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No recent transactions
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Newly recorded transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y rounded-lg border">
            {dashboard.recentTransactions.map((transaction, index) => (
              <RecentTransactionRow
                key={transaction.id ?? index}
                transaction={transaction}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function RecentTransactionRow({
  transaction,
}: {
  transaction: {
    type?: string;
    transactionType?: string;
    description?: string;
    name?: string;
    createdAt?: string;
    created_at?: string;
  };
}) {
  const transactionType =
    transaction.type ?? transaction.transactionType ?? "Transaction";

  const description =
    transaction.description ?? transaction.name ?? "Civil registry transaction";

  const date = transaction.createdAt ?? transaction.created_at;

  return (
    <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {transactionType}
        </p>

        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {date && (
        <span className="text-xs text-slate-400">{formatDate(date)}</span>
      )}
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-7 w-60 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <Card key={index} className="h-36 animate-pulse bg-slate-50" />
        ))}
      </div>

      <Card className="h-36 animate-pulse bg-slate-50" />

      <Card className="h-64 animate-pulse bg-slate-50" />
    </div>
  );
}

function DashboardError({
  message,
  onRetry,
  isRetrying,
}: {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-lg p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-red-50 p-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

            <Button
              type="button"
              className="mt-4"
              variant="outline"
              disabled={isRetrying}
              onClick={onRetry}
            >
              {isRetrying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
