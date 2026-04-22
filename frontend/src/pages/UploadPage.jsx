import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { uploadCSV } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UploadPage = ({ setCsvUrl }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const navigate = useNavigate();

    // Drag & Drop logic
    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
        setUploadSuccess(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        multiple: false
    });

    const handleUpload = async () => {
        try {
            const response = await uploadCSV(file);
            const url = response.data.csvUrl;

            setCsvUrl(url); // Global state update karo
            navigate('/dashboard'); // Phir navigate karo
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Check console.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Upload your <span className="text-accent">Dataset</span></h1>
                <p className="text-slate-400">We'll analyze your CSV for bias and discrimination patterns.</p>
            </div>

            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4",
                    isDragActive ? "border-accent bg-accent/5" : "border-slate-800 hover:border-slate-700 bg-card-bg/30",
                    uploadSuccess && "border-success/50 bg-success/5"
                )}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                            <div className="bg-slate-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Upload className="text-slate-400" />
                            </div>
                            <p className="text-lg font-medium">Drag & drop your CSV file here</p>
                            <p className="text-sm text-slate-500">or click to browse files</p>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <FileText className="text-accent" />
                            <div className="text-left">
                                <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            {uploadSuccess && <CheckCircle2 className="text-success w-5 h-5" />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-center">
                {!uploadSuccess ? (
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2"
                    >
                        {uploading ? "Uploading..." : "Verify & Upload"}
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/dashboard', { state: { csvUrl } })}
                        className="bg-success hover:bg-success/90 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2"
                    >
                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                <div className="p-4 rounded-xl border border-slate-800 bg-card-bg/20">
                    <AlertCircle className="text-accent mb-2 w-5 h-5" />
                    <h4 className="font-medium mb-1 italic text-sm text-slate-300">Privacy First</h4>
                    <p className="text-xs text-slate-500">Your data is processed securely and deleted after analysis.</p>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;