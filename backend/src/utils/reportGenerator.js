const PDFDocument = require('pdfkit');

exports.generatePDF = (data, stream) => {
    const doc = new PDFDocument({ margin: 50 });

    // Pipe the PDF to the response stream
    doc.pipe(stream);

    // --- Header ---
    doc.fontSize(25).text('AI Bias Audit Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown();
    doc.hr = doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // --- Summary Section ---
    doc.fontSize(18).fillColor('#2c3e50').text('Analysis Summary');
    doc.fontSize(12).fillColor('black').text(`Overall Bias Score: ${data.biasScore}%`);
    doc.fontSize(14).fillColor(data.verdict === 'BIASED' ? 'red' : 'green').text(`Verdict: ${data.verdict}`);
    doc.moveDown();

    // --- Metrics ---
    doc.fillColor('black').fontSize(16).text('Key Metrics');
    doc.fontSize(11).text(`Demographic Parity: ${data.metrics.demographicParity}`);
    doc.text(`Equalized Odds: ${data.metrics.equalizedOdds}`);
    doc.text(`Disparate Impact: ${data.metrics.disparateImpact}`);
    doc.moveDown();

    // --- Suggestions ---
    doc.fontSize(16).text('Recommendations');
    data.fixSuggestions.forEach((sug, index) => {
        doc.fontSize(11).text(`${index + 1}. [${sug.severity}] ${sug.suggestion}`);
    });

    // Finalize the PDF
    doc.end();
};