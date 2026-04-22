import React from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { downloadReport } from '../services/api';
import { Download } from 'lucide-react';

const ComparisonPage = ({ data }) => {
    // data hume dashboard se ya context se milega
    const stats = data?.groupStats || [
        { group: "Group A", approvalRate: 75, total: 100 },
        { group: "Group B", approvalRate: 42, total: 100 }
    ];

    const handleDownload = async () => {
        try {
            const response = await downloadReport(data);

            // Blob conversion for download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Audit_Report_${data.verdict}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed", err);
            alert("Could not download the report.");
        }
    };

    return (
        <div className="space-y-10 py-6">
            <div className="text-left">
                <h2 className="text-3xl font-bold">Group Comparison</h2>
                <p className="text-slate-400 mt-2">Detailed breakdown of how different demographics are being treated.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Comparison Line in Middle */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-accent p-2 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                        <ArrowRight className="text-white w-6 h-6" />
                    </div>
                </div>

                {stats.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card-bg border border-slate-800 p-8 rounded-3xl relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-slate-800 p-3 rounded-xl">
                                <User className={idx === 0 ? "text-accent" : "text-purple-500"} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">{item.group}</h4>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Target Group</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-400">Approval Rate</span>
                                    <span className="text-white font-bold">{item.approvalRate}%</span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full ${item.approvalRate > 50 ? 'bg-accent' : 'bg-danger'}`}
                                        style={{ width: `${item.approvalRate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Fix Suggestions Section */}
            <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-success" /> Recommended Fixes
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.fixSuggestions?.map((fix, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-card-bg border border-slate-800 hover:border-slate-700 transition-all">
                            <div className="shrink-0">
                                <AlertCircle className={fix.severity === 'High' ? "text-danger" : "text-warning text-yellow-500"} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize">{fix.severity}</span>
                                    <span className="text-xs text-success font-medium">{fix.estimatedImprovement}</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">{fix.suggestion}</p>
                            </div>
                        </div>
                    )) || <p className="text-slate-500 italic">Analysis complete. No critical fixes required.</p>}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center py-12 border-t border-slate-800 mt-12">
                <h3 className="text-xl font-bold mb-4">Need a physical copy?</h3>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-3 bg-accent hover:bg-accent/90 text-white px-10 py-4 rounded-2xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
                >
                    <Download className="w-5 h-5" /> Download PDF Audit Report
                </button>
            </div>
        </div>
    );
};

export default ComparisonPage;