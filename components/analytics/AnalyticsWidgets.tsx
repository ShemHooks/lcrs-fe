"use client";

import { useState } from "react";
import {
  Baby,
  Heart,
  Skull,
} from "lucide-react";

import StatCard from "@/components/analytics/StatCard";
import TrendChart from "@/components/analytics/TrendChart";
import GroupedBarChart from "@/components/analytics/GroupedBarChart";
import DonutChart from "@/components/analytics/DonutChart";
import SortableBarList from "@/components/analytics/SortableBarList";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";

import type { DashboardAnalyticsData } from "@/server/api/Analytics";

const BIRTH_MONTH_COLORS = {
  Male: "#2563eb",
  Female: "#db2777",
};

const DEATH_MONTH_COLORS = {
  Male: "#0f766e",
  Female: "#f59e0b",
};

const GENDER_COLORS = {
  Male: "#2563eb",
  Female: "#db2777",
  Unknown: "#94a3b8",
};

const AGE_BRACKET_COLORS = {
  Death: "#64748b",
  Marriage: "#db2777",
};

interface AnalyticsWidgetsProps {
  data: DashboardAnalyticsData;
}

/**
 * Analytics-sidebar widgets driven by GET /api/analytics/dashboard:
 * record-count summary cards, monthly/weekly registration trends,
 * monthly-by-gender charts, gender donuts, age-bracket bars and the
 * birth-by-barangay distribution.
 */
export default function AnalyticsWidgets({ data }: AnalyticsWidgetsProps) {
  const [donutType, setDonutType] = useState<"birth" | "death">("birth");

  const monthKeys = data.monthlyTrends.months;

  const weeklyKeys = data.weeklyTrends.weeks;

  const weekSeriesHasData =
    data.weeklyTrends.births.length > 0 ||
    data.weeklyTrends.marriages.length > 0 ||
    data.weeklyTrends.deaths.length > 0;

  const birthGender = data.births.monthlyByGender;

  const deathGender = data.deaths.monthlyByGender;

  const statusDonut =
    donutType === "birth"
      ? [
          {
            label: "Male",
            value: birthGender.Male.reduce((a, b) => a + b, 0),
            color: GENDER_COLORS.Male,
          },
          {
            label: "Female",
            value: birthGender.Female.reduce((a, b) => a + b, 0),
            color: GENDER_COLORS.Female,
          },
        ]
      : [
          {
            label: "Male",
            value: data.deaths.byGender.Male,
            color: GENDER_COLORS.Male,
          },
          {
            label: "Female",
            value: data.deaths.byGender.Female,
            color: GENDER_COLORS.Female,
          },
          {
            label: "Unknown",
            value: data.deaths.byGender.Unknown,
            color: GENDER_COLORS.Unknown,
          },
        ];

  return (
    <>
      {/* ===================================================== */}
      {/* RECORD COUNT SUMMARY CARDS */}
      {/* ===================================================== */}

      <AnalyticsSection
        title="Record Counts"
        description="Registration records created in the selected year."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Birth Records"
            value={data.recordCounts.births}
            description="Registered this year"
            icon={<Baby className="h-5 w-5 text-blue-600" />}
            valueClassName="text-blue-600"
          />

          <StatCard
            title="Marriage Records"
            value={data.recordCounts.marriages}
            description="Registered this year"
            icon={<Heart className="h-5 w-5 text-pink-600" />}
            valueClassName="text-pink-600"
          />

          <StatCard
            title="Death Records"
            value={data.recordCounts.deaths}
            description="Registered this year"
            icon={<Skull className="h-5 w-5 text-slate-600" />}
          />
        </div>
      </AnalyticsSection>

      {/* ===================================================== */}
      {/* TRENDS & VOLUME */}
      {/* ===================================================== */}

      <AnalyticsSection
        title="Trends & Volume"
        description="Registration volume over time, by record type."
      >
        <TrendChart
          title="Overall Registration Trends"
          description="Monthly registrations for births, marriages and deaths."
          cadence="month"
          keys={monthKeys}
          series={[
            {
              label: "Births",
              color: "#2563eb",
              values: data.monthlyTrends.births,
            },
            {
              label: "Marriages",
              color: "#db2777",
              values: data.monthlyTrends.marriages,
            },
            {
              label: "Deaths",
              color: "#64748b",
              values: data.monthlyTrends.deaths,
            },
          ]}
        />

        {weekSeriesHasData && (
          <TrendChart
            title="Weekly Registration"
            description="Same series at weekly granularity — toggle between monthly and weekly."
            cadence="week"
            keys={weeklyKeys}
            series={[
              {
                label: "Births",
                color: "#2563eb",
                points: data.weeklyTrends.births,
              },
              {
                label: "Marriages",
                color: "#db2777",
                points: data.weeklyTrends.marriages,
              },
              {
                label: "Deaths",
                color: "#64748b",
                points: data.weeklyTrends.deaths,
              },
            ]}
          />
        )}
      </AnalyticsSection>

      {/* ===================================================== */}
      {/* MONTHLY GENDER BREAKDOWNS */}
      {/* ===================================================== */}

      <AnalyticsSection
        title="Monthly by Gender"
        description="Male vs female registrations per month."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <GroupedBarChart
            title="Birth Records by Gender (Monthly)"
            description="Male vs female births per month."
            labels={monthKeys.map((key) =>
              new Date(`${key}-01T00:00:00Z`).toLocaleString("en-US", {
                month: "short",
                timeZone: "UTC",
              }),
            )}
            series={[
              {
                label: "Male",
                color: BIRTH_MONTH_COLORS.Male,
                values: birthGender.Male,
              },
              {
                label: "Female",
                color: BIRTH_MONTH_COLORS.Female,
                values: birthGender.Female,
              },
            ]}
          />

          <GroupedBarChart
            title="Death Records by Gender (Monthly)"
            description="Male vs female deaths per month."
            labels={monthKeys.map((key) =>
              new Date(`${key}-01T00:00:00Z`).toLocaleString("en-US", {
                month: "short",
                timeZone: "UTC",
              }),
            )}
            series={[
              {
                label: "Male",
                color: DEATH_MONTH_COLORS.Male,
                values: deathGender.Male,
              },
              {
                label: "Female",
                color: DEATH_MONTH_COLORS.Female,
                values: deathGender.Female,
              },
            ]}
          />
        </div>
      </AnalyticsSection>

      {/* ===================================================== */}
      {/* DISTRIBUTION */}
      {/* ===================================================== */}

      <AnalyticsSection
        title="Distribution"
        description="Gender and age distributions across record types."
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex overflow-hidden rounded-md border border-slate-200 text-xs">
                {(["birth", "death"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDonutType(option)}
                    className={`px-3 py-1 capitalize transition ${
                      donutType === option
                        ? "bg-[#92191d] text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {option} records
                  </button>
                ))}
              </div>
            </div>

            <DonutChart
              title={
                donutType === "birth"
                  ? "Birth Gender Distribution"
                  : "Death Gender Distribution"
              }
              description="Share of records by gender."
              segments={statusDonut}
              centerLabel="Records"
            />
          </div>

          <div className="space-y-4">
            <GroupedBarChart
              title="Death Records by Age Bracket"
              description="Deaths grouped into age buckets."
              labels={data.deaths.byAgeBracket.map((b) => b.label)}
              series={[
                {
                  label: "Deaths",
                  color: AGE_BRACKET_COLORS.Death,
                  values: data.deaths.byAgeBracket.map((b) => b.count),
                },
              ]}
            />

            <GroupedBarChart
              title="Marriage Records by Age Bracket"
              description="One group per bracket — groom vs bride."
              labels={data.marriages.byAgeBracket.groom.map((b) => b.label)}
              series={[
                {
                  label: "Groom",
                  color: "#2563eb",
                  values: data.marriages.byAgeBracket.groom.map((b) => b.count),
                },
                {
                  label: "Bride",
                  color: "#db2777",
                  values: data.marriages.byAgeBracket.bride.map((b) => b.count),
                },
              ]}
            />
          </div>
        </div>
      </AnalyticsSection>

      {/* ===================================================== */}
      {/* GEOGRAPHIC */}
      {/* ===================================================== */}

      <AnalyticsSection
        title="Geographic"
        description="Where registrations come from."
      >        <SortableBarList
          title="Birth Records by Barangay"
          description="Place of birth (falls back to the registration address)."
          items={data.births.byBarangay}
          color="bg-blue-500"
        />
      </AnalyticsSection>
    </>);
}
