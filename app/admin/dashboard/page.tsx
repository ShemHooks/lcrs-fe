"use client";

import React from "react";
import Link from "next/link";

import DashboardCard from "@/components/reusable/DashboardCard";

import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Heart,
  Loader2,
  Skull,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import { useAdminDashboardStats } from "@/server/hooks/dashboardHooks";

export default function AdminDashboardPage() {
  // ============================================================
  // ADMIN DASHBOARD
  // ============================================================

  const { data, isLoading, isError, error } = useAdminDashboardStats();

  // ============================================================
  // CALENDAR
  // ============================================================

  const [calendarDate, setCalendarDate] = React.useState(() => new Date());

  const today = new Date();

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const monthName = calendarDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const previousMonth = () => {
    setCalendarDate(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCalendarDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  };

  const goToToday = () => {
    setCalendarDate(new Date());
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#92191d]" />

          <p className="mt-3 text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-lg p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-red-50 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Unable to load dashboard
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {error instanceof Error
                  ? error.message
                  : "Unable to load admin dashboard data."}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD DATA
  // ============================================================

  const dashboard = data?.dashboard;

  const birthStats = dashboard?.birthStats ?? {
    total: 0,
    male: 0,
    female: 0,
  };

  const marriageStats = dashboard?.marriageStats ?? {
    total: 0,
  };

  const deathStats = dashboard?.deathStats ?? {
    total: 0,
    male: 0,
    female: 0,
  };

  const activeUsers = dashboard?.activeUsers ?? 0;

  const pendingRegistration = dashboard?.pendingRegistration ?? 0;

  // ============================================================
  // CARDS
  // ============================================================

  const cards = [
    {
      title: "Birth Records",

      value: birthStats.total,

      description: `Male: ${birthStats.male ?? 0} | Female: ${
        birthStats.female ?? 0
      }`,

      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500">
          <FileText className="h-8 w-8 text-white" />
        </div>
      ),

      action: <TrendingUp className="h-5 w-5 text-red-500" />,

      valueClassName: "text-red-500",
    },

    {
      title: "Marriage Records",

      value: marriageStats.total,

      description: "Total Marriages Registered",

      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pink-500">
          <Heart className="h-8 w-8 text-white" />
        </div>
      ),

      action: <TrendingUp className="h-5 w-5 text-pink-500" />,

      valueClassName: "text-pink-500",
    },

    {
      title: "Death Records",

      value: deathStats.total,

      description: `Male: ${deathStats.male ?? 0} | Female: ${
        deathStats.female ?? 0
      }`,

      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-500">
          <Skull className="h-8 w-8 text-white" />
        </div>
      ),

      action: <TrendingUp className="h-5 w-5 text-slate-500" />,

      valueClassName: "text-slate-500",
    },

    {
      title: "System Users",

      value: activeUsers,

      description: "Active Users",

      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-500">
          <Users className="h-8 w-8 text-white" />
        </div>
      ),

      action: <TrendingUp className="h-5 w-5 text-green-500" />,

      valueClassName: "text-green-500",
    },
  ];

  // ============================================================
  // QUICK ACTIONS
  // ============================================================

  const quickActions = [
    {
      title: "Registration Queue",
      description:
        "Process approved certificates awaiting official registration.",
      href: "/admin/jobs",
      icon: ClipboardCheck,
    },
    {
      title: "Civil Registry Records",
      description: "Browse officially registered civil registry records.",
      href: "/admin/records",
      icon: FileText,
    },
    {
      title: "Manage Users",
      description: "Manage staff, reviewers, and system accounts.",
      href: "/admin/users",
      icon: UserCog,
    },
    {
      title: "View Analytics",
      description: "View civil registry statistics and reports.",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6">
      {/* ===================================================== */}
      {/* SUMMARY CARDS */}
      {/* ===================================================== */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
            action={card.action}
            valueClassName={card.valueClassName}
          />
        ))}
      </div>

      {/* ===================================================== */}
      {/* REGISTRATION STATUS + QUICK ACTIONS */}
      {/* ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ================================================= */}
        {/* PENDING REGISTRATION */}
        {/* ================================================= */}

        <Card className="overflow-hidden border border-slate-200 bg-white p-0 shadow-sm">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Awaiting Registration
                </p>

                <p className="mt-2 text-4xl font-bold text-[#92191d]">
                  {pendingRegistration}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
                <ClipboardCheck className="h-6 w-6 text-[#92191d]" />
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Approved birth certificates waiting for an official registry
              number.
            </p>
          </div>

          <Link
            href="/admin/jobs"
            className="flex items-center justify-between border-t bg-slate-50 px-6 py-4 text-sm font-medium text-[#92191d] transition hover:bg-slate-100"
          >
            Open registration queue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        {/* ================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================= */}

        <Card className="border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Common registrar and system administration tasks.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-start gap-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-[#92191d]/30 hover:bg-red-50/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-[#92191d]">
                    <Icon className="h-5 w-5 text-slate-600 transition group-hover:text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-800">
                        {action.title}
                      </h3>

                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#92191d]" />
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ===================================================== */}
      {/* CALENDAR */}
      {/* ===================================================== */}

      <Card className="overflow-hidden border border-slate-200 bg-white p-0 shadow-sm">
        {/* CALENDAR HEADER */}

        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50">
              <CalendarDays className="h-5 w-5 text-[#92191d]" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">Calendar</h2>

              <p className="text-sm text-slate-500">{monthName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#92191d]/30 hover:bg-red-50 hover:text-[#92191d]"
            >
              Today
            </button>

            <button
              type="button"
              onClick={previousMonth}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-[#92191d]/30 hover:bg-red-50 hover:text-[#92191d]"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={nextMonth}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-[#92191d]/30 hover:bg-red-50 hover:text-[#92191d]"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CALENDAR BODY */}

        <div className="overflow-x-auto p-6">
          <div className="min-w-[700px] overflow-hidden rounded-lg border border-slate-200">
            {/* WEEK DAYS */}

            <div className="grid grid-cols-7 bg-slate-50">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <div
                  key={day}
                  className="border-r border-slate-200 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 last:border-r-0"
                >
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* CALENDAR DATES */}

            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <div
                  key={`${day ?? "empty"}-${index}`}
                  className={`relative min-h-[95px] border-r border-t border-slate-200 p-3 transition last:border-r-0 ${
                    day ? "bg-white hover:bg-slate-50" : "bg-slate-50/50"
                  }`}
                >
                  {day && (
                    <>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                          isToday(day)
                            ? "bg-[#92191d] font-semibold text-white shadow-sm"
                            : "text-slate-700"
                        }`}
                      >
                        {day}
                      </div>

                      {isToday(day) && (
                        <div className="mt-2">
                          <span className="inline-flex rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#92191d]">
                            Today
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
