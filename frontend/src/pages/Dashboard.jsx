import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { runAnalysis } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { VerdictBanner } from '../components/ui/VerdictBanner';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const Dashboard = ({ data }) => {
    const navigate = useNavigate();

    // 2. Error State
    if (!data) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-2xl font-bold text-white">Analysis Failed</h2>
            <p className="text-slate-400 max-w-md">{"No data received from the server."}</p>
            <button
                onClick={() => navigate('/')}
                className="mt-4 bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl border border-slate-700 transition-all"
            >
                Try Uploading Again
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Verdict Section & Navigation */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <VerdictBanner
                    verdict={data?.verdict || "UNCERTAIN"}
                    score={data?.biasScore || 0}
                />
                <button
                    onClick={() => navigate('/comparison')}
                    className="shrink-0 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl border border-slate-700 transition-all text-sm font-bold shadow-lg group"
                >
                    View Detailed Comparison
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* 2. Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Demographic Parity"
                    value={data?.metrics?.demographicParity ?? "N/A"}
                    subtext="Ideal: close to 0"
                />
                <StatCard
                    title="Equalized Odds"
                    value={data?.metrics?.equalizedOdds ?? "N/A"}
                    subtext="Consistency across groups"
                />
                <StatCard
                    title="Disparate Impact"
                    value={data?.metrics?.disparateImpact ?? "N/A"}
                    subtext="Selection rate ratio"
                />
            </div>

            {/* 3. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Comparison Bar Chart */}
                <div className="bg-card-bg border border-slate-800 p-6 rounded-[2rem] shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-slate-200">Approval Rate by Group</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.groupStats || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="group" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                />
                                <Bar dataKey="approvalRate" radius={[6, 6, 0, 0]}>
                                    {(data?.groupStats || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#6366f1" : "#a855f7"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Features Chart */}
                <div className="bg-card-bg border border-slate-800 p-6 rounded-[2rem] shadow-xl">
                    <h3 className="text-lg font-semibold mb-6 text-slate-200">Feature Importance</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.topFeatures || []} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="feature"
                                    type="category"
                                    stroke="#94a3b8"
                                    width={100}
                                    fontSize={11}
                                />
                                <Tooltip
                                    cursor={false}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                />
                                <Bar dataKey="importance" fill="#22c55e" radius={[0, 6, 6, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;