const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path'); // Import the path module

async function generateCertificate(studentAddress, studentName, courseCompleted) {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a page to the document
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Define font size
    const fontSize = 24;

    // Draw text on the page
    page.drawText(`Certificate of Completion`, {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText(`This is to certify that`, {
        x: 50,
        y: height - 6 * fontSize,
        size: fontSize,
        color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText(studentName, {
        x: 50,
        y: height - 8 * fontSize,
        size: fontSize,
        color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText(`has completed the course:`, {
        x: 50,
        y: height - 10 * fontSize,
        size: fontSize,
        color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText(courseCompleted, {
        x: 50,
        y: height - 12 * fontSize,
        size: fontSize,
        color: rgb(0.2, 0.2, 0.2),
    });

    // Serialize the PDF document to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Define the certificates directory
    const certificatesDir = path.join(__dirname, 'certificates');
    // Ensure the certificates directory exists
    if (!fs.existsSync(certificatesDir)){
        fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // Write the PDF to a file
    const filePath = path.join(certificatesDir, `${studentName.replace(/ /g, '_')}_${Date.now()}.pdf`);
    fs.writeFileSync(filePath, pdfBytes);

    return filePath;
}

module.exports = {
    generateCertificate
};
