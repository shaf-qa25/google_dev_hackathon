import { AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export const VerdictBanner = ({ verdict, score }) => {
    const isBiased = verdict === "BIASED";
    return (
        <div className={cn(
            "w-full p-6 rounded-2xl border-l-8 flex items-center justify-between",
            isBiased ? "bg-danger/10 border-danger" : "bg-success/10 border-success"
        )}>
            <div className="flex items-center gap-4">
                {isBiased ? <AlertTriangle className="text-danger w-10 h-10" /> : <CheckCircle className="text-success w-10 h-10" />}
                <div>
                    <h2 className={cn("text-2xl font-bold", isBiased ? "text-danger" : "text-success")}>
                        {verdict} VERDICT
                    </h2>
                    <p className="text-slate-400">Bias Score: <span className="font-bold text-white">{score}%</span></p>
                </div>
            </div>
            <div className="text-right hidden md:block">
                <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Severity Level</p>
                <p className={isBiased ? "text-danger" : "text-success"}>{isBiased ? "Action Required" : "Model Safe"}</p>
            </div>
        </div>
    );
};