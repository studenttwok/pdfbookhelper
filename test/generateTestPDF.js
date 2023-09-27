const {PDFDocument, StandardFonts, rgb, grayscale} = require('pdf-lib');
const fs = require('fs');


const generateTestPDF = async () => {

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    // Embed the Times Roman font
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    // Add a blank page to the document
    const page = pdfDoc.addPage([600, 600])

    const {width, height} = page.getSize();

    // seet the box
    page.setMediaBox(0, 0, 600, 600);
    page.setCropBox(50, 50, 500, 500);
    page.setBleedBox(100, 100, 400, 400);
    page.setTrimBox(150, 150, 300, 300);
    page.setArtBox(200, 200, 200, 200);

    page.drawRectangle({
        x: 0,
        y: 0,
        width: 600,
        height: 600,
        borderWidth: 1,
        borderColor: grayscale(0.5),
        color: rgb(1, 0, 0),
    });

    page.drawRectangle({
        x: 50,
        y: 50,
        width: 500,
        height: 500,
        borderWidth: 1,
        borderColor: grayscale(0.5),
        color: rgb(0, 1, 0),
    });

    page.drawRectangle({
        x: 100,
        y: 100,
        width: 400,
        height: 400,
        borderWidth: 1,
        borderColor: grayscale(0.5),
        color: rgb(0, 0, 1),
    });

    page.drawRectangle({
        x: 150,
        y: 150,
        width: 300,
        height: 300,
        borderWidth: 1,
        borderColor: grayscale(0.5),
        color: rgb(1, 1, 0),
    });

    page.drawRectangle({
        x: 200,
        y: 200,
        width: 200,
        height: 200,
        borderWidth: 1,
        borderColor: grayscale(0.5),
        color: rgb(1, 0, 1),
    });

    
    // Draw a string of text toward the top of the page
    const fontSize = 30
    page.drawText('MediaBox', {
        x: 0,
        y: 0,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 1, 0),
    });

    page.drawText('CropBox', {
        x: 50,
        y: 50,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(1, 0, 0),
    });

    page.drawText('BleedBox', {
        x: 100,
        y: 100,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(1, 0, 0),
    });   

    page.drawText('TrimBox', {
        x: 150,
        y: 150,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(1, 0, 0),
    });

    page.drawText('ArtBox', {
        x: 200,
        y: 200,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 1, 0),
    });


    const page2 = await pdfDoc.copyPages(pdfDoc, [0]);
    const page3 = await pdfDoc.copyPages(pdfDoc, [0]);
    const page4 = await pdfDoc.copyPages(pdfDoc, [0]);

    // Page Content
    page.drawText('P1', {
        x: 300,
        y: 300,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 1),
    });

    // Page Content
    page2[0].drawText('P2', {
        x: 300,
        y: 300,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 1),
    });
    page3[0].drawText('P3', {
        x: 300,
        y: 300,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 1),
    });
    page4[0].drawText('P4', {
        x: 300,
        y: 300,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 1),
    });

    pdfDoc.addPage(page2[0]);
    pdfDoc.addPage(page3[0]);
    pdfDoc.addPage(page4[0]);

    
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()
    await fs.writeFileSync('sample.pdf', pdfBytes);

}

generateTestPDF();