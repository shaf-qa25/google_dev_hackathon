import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { runAnalysis } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { VerdictBanner } from '../components/ui/VerdictBanner';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react'; // Missing import fix

const Dashboard = ({ csvUrl, setGlobalData }) => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                // Mock config for now
                const config = { target: "Approved", sensitive: "Gender" };
                const response = await runAnalysis(csvUrl, config);

                const result = response.data.data; // API response data
                setData(result);
                setGlobalData(result); // Sync with global state for Comparison Page
            } catch (err) {
                console.error("Analysis failed", err);
            } finally {
                setLoading(false);
            }
        };

        if (csvUrl) fetchAnalysis();
    }, [csvUrl, setGlobalData]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-accent font-medium animate-pulse">Running ML Audit Engine...</p>
        </div>
    );

    if (!data) return <div className="text-center py-20 text-danger">No Data Available. Please upload again.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. Verdict Section & Navigation */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <VerdictBanner verdict={data.verdict} score={data.biasScore} />
                <button
                    onClick={() => navigate('/comparison')}
                    className="shrink-0 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl border border-slate-700 transition-all text-sm font-bold shadow-lg"
                >
                    View Detailed Comparison <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* 2. Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Demographic Parity" value={data.metrics.demographicParity} subtext="Ideal: close to 0" />
                <StatCard title="Equalized Odds" value={data.metrics.equalizedOdds} subtext="Consistency across groups" />
                <StatCard title="Disparate Impact" value={data.metrics.disparateImpact} subtext="Selection rate ratio" />
            </div>

            {/* 3. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Comparison Bar Chart */}
                <div className="bg-card-bg border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-6">Approval Rate by Group</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.groupStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="group" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                />
                                <Bar dataKey="approvalRate" radius={[4, 4, 0, 0]}>
                                    {data.groupStats.map((entry, index) => (
                                        <Cell key={index} fill={index === 0 ? "#6366f1" : "#a855f7"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Features Chart */}
                <div className="bg-card-bg border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-6">Feature Importance</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topFeatures} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="feature" type="category" stroke="#94a3b8" width={80} />
                                <Tooltip cursor={false} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Bar dataKey="importance" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;