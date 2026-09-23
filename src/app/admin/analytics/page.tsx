"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import UserPsychologyTable from "@/components/admin/UserPsychologyTable";

// Note: In a real app, this fetching would happen securely via a Next.js API Route 
// or Server Action since firebase-admin can only run on the server.
// For this architecture phase, we simulate the fetch endpoint to demonstrate the UI.

const mockData = {
  mrr: 4500,
  tiers: { freemium: 1500, trial: 300, awakened: 50, inner_sanctum: 25 },
  atRiskUsers: [
    { uid: "1", email: "seeker@example.com", trialEndsInHours: 12 },
    { uid: "2", email: "wanderer@example.com", trialEndsInHours: 40 }
  ],
  psychologyData: [
    { uid: "3", email: "philosopher@example.com", solvedEnigmas: 3, dailyInteractions: 12 },
    { uid: "4", email: "thinker@example.com", solvedEnigmas: 1, dailyInteractions: 6 }
  ]
};

const growthData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 800 },
  { name: 'Mar', users: 1200 },
  { name: 'Apr', users: 1500 },
  { name: 'May', users: 1875 },
];

const COLORS = ['#333333', '#666666', '#D4AF37', '#FFDF00'];

export default function AnalyticsDashboard() {
  const { user, userDoc, loading } = useUserStore();
  const router = useRouter();
  const [data, setData] = useState(mockData);

  useEffect(() => {
    if (!loading) {
      if (!user || !userDoc || userDoc.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, userDoc, loading, router]);

  if (loading || !userDoc || userDoc.role !== 'admin') {
    return null;
  }

  const pieData = [
    { name: 'Freemium', value: data.tiers.freemium },
    { name: 'Trial', value: data.tiers.trial },
    { name: 'Awakened', value: data.tiers.awakened },
    { name: 'Inner Sanctum', value: data.tiers.inner_sanctum },
  ];

  return (
    <div className="min-h-screen bg-obsidian pt-24 pb-20 px-4 md:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-gold/10 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-amiri text-gold-light mb-2">عين الإله (God's Eye)</h1>
            <p className="text-neutral-500 text-sm tracking-widest uppercase">Elite Analytics Engine</p>
          </div>
          <div className="text-right">
            <p className="text-neutral-400 text-sm mb-1">Monthly Recurring Revenue</p>
            <p className="text-4xl font-cinzel text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
              ${data.mrr.toLocaleString()}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* User Growth Line Chart */}
          <div className="lg:col-span-2 bg-neutral-900/50 border border-gold/10 p-6 rounded-sm">
            <h2 className="text-xl font-amiri text-gold-light mb-6">مؤشر النمو</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#D4AF37' }}
                    itemStyle={{ color: '#D4AF37' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#D4AF37" strokeWidth={3} dot={{ fill: '#050505', stroke: '#D4AF37', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subscriptions Donut Chart */}
          <div className="bg-neutral-900/50 border border-gold/10 p-6 rounded-sm flex flex-col">
            <h2 className="text-xl font-amiri text-gold-light mb-2">توزيع الطبقات</h2>
            <div className="flex-1 w-full relative min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#D4AF37' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-2xl font-cinzel text-gold/50">{data.tiers.awakened + data.tiers.inner_sanctum}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gamification Psychology Tracker */}
          <div className="bg-neutral-900/50 border border-gold/10 p-6 rounded-sm">
            <h2 className="text-xl font-amiri text-gold-light mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              أهداف الاستحواذ (Highly Engaged)
            </h2>
            <UserPsychologyTable data={data.psychologyData} />
          </div>

          {/* At-Risk Users */}
          <div className="bg-neutral-900/50 border border-gold/10 p-6 rounded-sm">
            <h2 className="text-xl font-amiri text-red-500/80 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              خطر التسرب (At-Risk Trials)
            </h2>
            <div className="space-y-4">
              {data.atRiskUsers.map(user => (
                <div key={user.uid} className="flex justify-between items-center bg-obsidian p-4 border border-red-900/30 rounded-sm">
                  <div>
                    <p className="text-neutral-300 font-mono text-sm">{user.email}</p>
                    <p className="text-red-500/60 text-xs mt-1">ينتهي خلال {user.trialEndsInHours} ساعة</p>
                  </div>
                  <button className="text-xs bg-red-900/20 text-red-400 border border-red-900/50 px-3 py-1 rounded-sm hover:bg-red-900/40 transition-colors">
                    إرسال خصم
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

