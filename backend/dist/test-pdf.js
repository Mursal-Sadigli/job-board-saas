"use strict";
const pdf = require('pdf-parse');
console.log('Imported pdf type:', typeof pdf);
console.log('Imported pdf keys:', Object.keys(pdf || {}));
if (pdf.PDFParse) {
    console.log('pdf.PDFParse type:', typeof pdf.PDFParse);
}
if (pdf.default) {
    console.log('pdf.default type:', typeof pdf.default);
    if (typeof pdf.default === 'object') {
        console.log('pdf.default keys:', Object.keys(pdf.default));
    }
}
try {
    // Try to see if it's a class
    if (typeof pdf.PDFParse === 'function') {
        console.log('PDFParse is a function/class');
    }
}
catch (e) {
    console.log('Error inspecting PDFParse:', e.message);
}
