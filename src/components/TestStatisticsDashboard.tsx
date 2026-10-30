/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Database,
  Calendar,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Language, TestResultRecord } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playSound } from '../services/soundEffects';

interface TestStatisticsDashboardProps {
  history: TestResultRecord[];
  onSeedData: () => void;
  currentLanguage: Language;
}

export const TestStatisticsDashboard: React.FC<TestStatisticsDashboardProps> = ({
  history,
  onSeedData,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  // 1. KPI Calculations
  const stats = useMemo(() => {
    const total = history.length;
    if (total === 0) {
      return {
        total: 0,
        safeCount: 0,
        suspiciousCount: 0,
        unsafeCount: 0,
        safeRate: 0,
        unsafeRate: 0,
        suspiciousRate: 0,
        mostCommonFood: 'N/A',
        mostAdulteratedItem: 'N/A',
      };
    }

    const safeCount = history.filter((h) => h.status === 'safe').length;
    const suspiciousCount = history.filter((h) => h.status === 'suspicious').length;
    const unsafeCount = history.filter((h) => h.status === 'unsafe').length;

    const safeRate = Math.round((safeCount / total) * 100);
    const unsafeRate = Math.round((unsafeCount / total) * 100);
    const suspiciousRate = Math.round((suspiciousCount / total) * 100);

    // Food counts
    const foodCounts: Record<string, number> = {};
    const foodUnsafeCounts: Record<string, number> = {};

    history.forEach((h) => {
      const food = h.foodName || 'OTHER';
      foodCounts[food] = (foodCounts[food] || 0) + 1;
      if (h.status === 'unsafe') {
        foodUnsafeCounts[food] = (foodUnsafeCounts[food] || 0) + 1;
      }
    });

    let mostCommonFood = 'N/A';
    let maxFoodCount = 0;
    Object.entries(foodCounts).forEach(([food, count]) => {
      if (count > maxFoodCount) {
        maxFoodCount = count;
        mostCommonFood = food;
      }
    });

    let mostAdulteratedItem = 'None';
    let maxUnsafe = 0;
    Object.entries(foodUnsafeCounts).forEach(([food, count]) => {
      if (count > maxUnsafe) {
        maxUnsafe = count;
        mostAdulteratedItem = food;
      }
    });

    return {
      total,
      safeCount,
      suspiciousCount,
      unsafeCount,
      safeRate,
      unsafeRate,
      suspiciousRate,
      mostCommonFood,
      mostAdulteratedItem,
    };
  }, [history]);

  // 2. Frequency of Different Tests Data for Bar Chart
  const testFrequencyData = useMemo(() => {
    const map: Record<
      string,
      {
        testName: string;
        shortName: string;
        safe: number;
        suspicious: number;
        unsafe: number;
        total: number;
      }
    > = {};

    history.forEach((item) => {
      const key = item.testName;
      if (!map[key]) {
        // Shorten long test names for mobile display
        let shortName = key.replace(' Detection Test', '').replace(' Chemical Test', '').replace(' Test', '');
        if (shortName.length > 14) shortName = shortName.substring(0, 13) + '…';

        map[key] = {
          testName: key,
          shortName,
          safe: 0,
          suspicious: 0,
          unsafe: 0,
          total: 0,
        };
      }

      map[key].total += 1;
      if (item.status === 'safe') map[key].safe += 1;
      else if (item.status === 'suspicious') map[key].suspicious += 1;
      else if (item.status === 'unsafe') map[key].unsafe += 1;
    });

    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [history]);

  // 3. Success / Purity Rate Over Time Data for Line Chart
  const timeTrendData = useMemo(() => {
    if (history.length === 0) return [];

    // Sort chronologically ascending
    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);

    // Group by Date string (e.g., "Oct 24", "Oct 25")
    const dateGroups: Record<
      string,
      {
        date: string;
        timestamp: number;
        safe: number;
        suspicious: number;
        unsafe: number;
        total: number;
      }
    > = {};

    sorted.forEach((item) => {
      const d = new Date(item.timestamp);
      const dateKey = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = {
          date: dateKey,
          timestamp: item.timestamp,
          safe: 0,
          suspicious: 0,
          unsafe: 0,
          total: 0,
        };
      }

      dateGroups[dateKey].total += 1;
      if (item.status === 'safe') dateGroups[dateKey].safe += 1;
      else if (item.status === 'suspicious') dateGroups[dateKey].suspicious += 1;
      else if (item.status === 'unsafe') dateGroups[dateKey].unsafe += 1;
    });

    return Object.values(dateGroups).map((g) => ({
      date: g.date,
      safeRate: Math.round((g.safe / g.total) * 100),
      unsafeRate: Math.round((g.unsafe / g.total) * 100),
      totalTests: g.total,
      safeCount: g.safe,
      unsafeCount: g.unsafe,
    }));
  }, [history]);

  // 4. Status Distribution for Donut Chart
  const statusPieData = useMemo(() => {
    return [
      { name: 'Safe (Purity Pass)', value: stats.safeCount, color: '#10b981' },
      { name: 'Suspicious (Trace / Caution)', value: stats.suspiciousCount, color: '#f59e0b' },
      { name: 'Unsafe (Adulterated)', value: stats.unsafeCount, color: '#ef4444' },
    ].filter((item) => item.value > 0);
  }, [stats]);

  // 5. Food Category Breakdown Data
  const foodCategoryData = useMemo(() => {
    const map: Record<string, number> = {
      MILK: 0,
      TURMERIC: 0,
      CHILLI: 0,
      OIL: 0,
    };

    history.forEach((h) => {
      const key = (h.foodName || 'MILK').toUpperCase();
      map[key] = (map[key] || 0) + 1;
    });

    const colors: Record<string, string> = {
      MILK: '#0284c7', // Sky
      TURMERIC: '#eab308', // Amber
      CHILLI: '#e11d48', // Rose
      OIL: '#ea580c', // Orange
    };

    return Object.entries(map)
      .map(([name, count]) => ({
        name,
        count,
        color: colors[name] || '#64748b',
      }))
      .filter((i) => i.count > 0);
  }, [history]);

  return (
    <div className="space-y-6 pb-6">
      {/* Dashboard Top Intro Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span>Adulteration Testing Analytics</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Real-Time
              </span>
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              Frequency of test types and purity success rates based on local screening data.
            </p>
          </div>
        </div>

        {/* Benchmarking Seed Button */}
        <button
          onClick={() => {
            playSound('click');
            onSeedData();
          }}
          className="flex items-center gap-1.5 self-start sm:self-center bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
          title="Load sample testing dataset across milk, spices, and oils"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>{history.length < 5 ? 'Load Benchmark Sample Data' : 'Reset Benchmark Dataset'}</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Tests */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Screenings</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-mono">
              {stats.total}
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">Recorded tests</p>
          </div>
        </div>

        {/* Safety / Purity Rate */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs flex flex-col justify-between bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Purity Pass Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight font-mono">
              {stats.safeRate}%
            </div>
            <p className="text-[10px] text-emerald-600 mt-0.5">{stats.safeCount} samples passed safe</p>
          </div>
        </div>

        {/* Adulteration Alert Rate */}
        <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-2xs flex flex-col justify-between bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Adulteration Rate</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight font-mono">
              {stats.unsafeRate}%
            </div>
            <p className="text-[10px] text-rose-600 mt-0.5">{stats.unsafeCount} unsafe adulterants detected</p>
          </div>
        </div>

        {/* Caution / Suspicious Rate */}
        <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs flex flex-col justify-between bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Caution Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight font-mono">
              {stats.suspiciousRate}%
            </div>
            <p className="text-[10px] text-amber-600 mt-0.5">{stats.suspiciousCount} borderline / trace results</p>
          </div>
        </div>
      </div>

      {/* CHART 1: Frequency of Different Adulteration Tests Performed (Bar Chart) */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>Adulteration Test Frequency & Outcome Breakdown</span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Count of individual tests conducted with Safe (Green), Suspicious (Amber), and Unsafe (Red) counts.
            </p>
          </div>
          <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
            Stacked by Outcome
          </span>
        </div>

        {testFrequencyData.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-xs text-gray-400">
            No test data available. Perform a test or click &quot;Load Benchmark Sample Data&quot;.
          </div>
        ) : (
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={testFrequencyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="shortName"
                  tick={{ fontSize: 11, fill: '#4b5563' }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const safePct = Math.round((data.safe / data.total) * 100);
                      return (
                        <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-gray-800">
                          <p className="font-bold text-emerald-300">{data.testName}</p>
                          <div className="pt-1 space-y-0.5 text-[11px]">
                            <p className="flex justify-between gap-4 text-emerald-400">
                              <span>Safe (Pass):</span>
                              <span className="font-mono font-bold">{data.safe}</span>
                            </p>
                            <p className="flex justify-between gap-4 text-amber-400">
                              <span>Suspicious:</span>
                              <span className="font-mono font-bold">{data.suspicious}</span>
                            </p>
                            <p className="flex justify-between gap-4 text-rose-400">
                              <span>Unsafe (Alert):</span>
                              <span className="font-mono font-bold">{data.unsafe}</span>
                            </p>
                            <div className="border-t border-gray-700 pt-1 flex justify-between gap-4 font-bold text-white">
                              <span>Total Tests:</span>
                              <span className="font-mono">{data.total} ({safePct}% Safe)</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                />
                <Bar dataKey="safe" name="Safe" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="suspicious" name="Suspicious" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="unsafe" name="Unsafe" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* CHART 2: Success Rates Over Time (Line Chart) */}
      <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Food Purity Success Rate Over Time (%)</span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Daily percentage of tests that passed as Safe vs Adulterated over testing sessions.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Safe Rate %
            </span>
            <span className="flex items-center gap-1 font-semibold text-rose-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Adulterated %
            </span>
          </div>
        </div>

        {timeTrendData.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-xs text-gray-400">
            Insufficient timeline data. Run multiple tests to view chronological success rate trends.
          </div>
        ) : (
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeTrendData}
                margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-gray-800">
                          <p className="font-bold text-gray-200 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{data.date}</span>
                          </p>
                          <div className="pt-1 space-y-0.5 text-[11px]">
                            <p className="text-emerald-400 font-semibold">
                              Purity Success Rate: {data.safeRate}% ({data.safeCount}/{data.totalTests} safe)
                            </p>
                            <p className="text-rose-400 font-semibold">
                              Adulteration Rate: {data.unsafeRate}% ({data.unsafeCount} unsafe)
                            </p>
                            <p className="text-gray-400">Total Samples Tested: {data.totalTests}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="safeRate"
                  name="Safe Rate %"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="unsafeRate"
                  name="Unsafe Rate %"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Row with Donut & Food Category Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Overall Status Distribution Donut */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-700" />
              <span>Overall Safety Verdict Ratio</span>
            </h3>
          </div>

          {statusPieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-gray-400">
              No test data to display
            </div>
          ) : (
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        const pct = Math.round(((item.value as number) / stats.total) * 100);
                        return (
                          <div className="bg-gray-900 text-white p-2.5 rounded-xl shadow-lg text-xs border border-gray-800">
                            <span className="font-bold text-emerald-300">{item.name}: </span>
                            <span className="font-mono">{item.value} ({pct}%)</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Tests by Food Commodity */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Tested Food Commodities</span>
            </h3>
            <span className="text-[11px] font-semibold text-gray-500">
              Most tested: <strong>{stats.mostCommonFood}</strong>
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {foodCategoryData.map((food) => {
              const pct = stats.total > 0 ? Math.round((food.count / stats.total) * 100) : 0;
              return (
                <div key={food.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: food.color }}
                      />
                      <span>{food.name}</span>
                    </span>
                    <span className="font-mono text-gray-500">
                      {food.count} tests ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: food.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analytical Diagnostic Insights Box */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-900 text-white space-y-3 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-300" />
          <h4 className="font-bold text-sm text-emerald-100">Statistical Household Insights</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-100/90 leading-relaxed">
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
            <span className="font-bold text-white block mb-0.5">Commodity Safety Assessment:</span>
            {stats.safeRate >= 70 ? (
              <span>
                Your household suppliers currently demonstrate a high purity pass rate of {stats.safeRate}%. Keep performing routine spot checks on new batches.
              </span>
            ) : (
              <span>
                A low purity rate of {stats.safeRate}% was detected. Multiple tests triggered alerts. We strongly recommend switching loose suppliers or demanding AGMARK/FSSAI packaged brands.
              </span>
            )}
          </div>

          <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
            <span className="font-bold text-white block mb-0.5">Highest Risk Adulterant:</span>
            <span>
              {stats.mostAdulteratedItem !== 'None'
                ? `Food items in category "${stats.mostAdulteratedItem}" had the highest incidence of positive chemical reactions. Prioritize multi-test verification on this staple.`
                : 'No hazardous adulteration identified across tested samples.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
