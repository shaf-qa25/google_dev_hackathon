import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadCSV, runAnalysis } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UploadPage = ({ setCsvUrl, setGlobalData }) => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState(1); // Step 1: Upload, Step 2: Configure
    const [tempUrl, setTempUrl] = useState("");

    // Naye inputs jo Shivani ki API ko chahiye
    const [config, setConfig] = useState({
        target: "",
        sensitive: ""
    });

    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        multiple: false
    });

    // Pehle sirf file upload hogi
    const handleInitialUpload = async () => {
        setUploading(true);
        try {
            const response = await uploadCSV(file);
            setTempUrl(response.data.csvUrl);
            setStep(2); // Move to configuration step
        } catch (err) {
            alert("Upload failed. Check backend/Cloudinary.");
        } finally {
            setUploading(false);
        }
    };

    // Configuration ke baad final analysis call
    const handleStartAnalysis = async () => {
        setUploading(true);
        try {
            // Humne jo API response format discuss kiya hai, ye wahi fetch karega
            const response = await runAnalysis(tempUrl, config);

            setCsvUrl(tempUrl);
            setGlobalData(response.data.data); // Pure JSON format ko store karna
            navigate('/dashboard');
        } catch (err) {
            alert("Analysis failed. Make sure columns match your CSV.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Step Indicator */}
            <div className="flex justify-center gap-4 mb-8">
                <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-slate-800'}`} />
                <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-slate-800'}`} />
            </div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <div {...getRootProps()} className={`border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all cursor-pointer ${isDragActive ? 'border-accent bg-accent/5' : 'border-slate-800 hover:border-slate-700'}`}>
                            <input {...getInputProps()} />
                            <Upload className="mx-auto w-16 h-16 text-slate-500 mb-4" />
                            <h3 className="text-xl font-bold text-white">Drop your dataset here</h3>
                            <p className="text-slate-400 mt-2">Only CSV files are supported for bias auditing.</p>
                            {file && <div className="mt-4 p-3 bg-slate-800 rounded-xl inline-flex items-center gap-2 text-accent font-medium text-sm"><FileText size={16} /> {file.name}</div>}
                        </div>
                        <button onClick={handleInitialUpload} disabled={!file || uploading} className="w-full mt-6 bg-accent hover:bg-accent/90 py-4 rounded-2xl font-bold disabled:bg-slate-800 flex justify-center items-center gap-2">
                            {uploading ? "Uploading to Cloudinary..." : "Upload & Continue"} <ArrowRight size={20} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card-bg border border-slate-800 p-10 rounded-[2.5rem] space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Settings2 className="text-accent" />
                            <h3 className="text-2xl font-bold text-white">Model Configuration</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400 uppercase font-bold tracking-wider">Target Column</label>
                                <input
                                    placeholder="e.g. loan_status"
                                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-accent"
                                    value={config.target}
                                    onChange={(e) => setConfig({ ...config, target: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-500 italic">The column you want to predict.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400 uppercase font-bold tracking-wider">Sensitive Column</label>
                                <input
                                    placeholder="e.g. gender or race"
                                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-accent"
                                    value={config.sensitive}
                                    onChange={(e) => setConfig({ ...config, sensitive: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-500 italic">The attribute to check for bias.</p>
                            </div>
                        </div>

                        <button onClick={handleStartAnalysis} disabled={!config.target || !config.sensitive || uploading} className="w-full mt-6 bg-success hover:bg-success/90 py-4 rounded-2xl font-bold text-dark-bg flex justify-center items-center gap-2">
                            {uploading ? "Running Audit..." : "Start Bias Audit"} <CheckCircle2 size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UploadPage;