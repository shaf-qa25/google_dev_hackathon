import { ShieldAlert } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="border-b border-slate-800 bg-dark-bg/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="text-accent w-8 h-8" />
                    <span className="text-xl font-bold tracking-tight">AI Bias <span className="text-accent">Audit</span></span>
                </div>
                <div className="flex gap-6 text-sm font-medium text-slate-400">
                    <a href="/" className="hover:text-white transition-colors">Home</a>
                    <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;