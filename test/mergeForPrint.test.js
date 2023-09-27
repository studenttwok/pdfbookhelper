//import {getPagesBoxInfo, mergeForPrint, chopPages, halfTheWholePages} from 'pdfbookhelper';
//import {getPagesBoxInfo} from 'pdfbookhelper';

test('mergeForPrint', async () => {
    const fs = require('fs');
    const { mergeForPrint } = require('../src/index');
    const {PDFDocument} = require('pdf-lib');

    const test_input = "./test/assets/sample.pdf";
    const test_output = "./test/assets/mergeForPrint_output.pdf";
    await mergeForPrint(test_input, test_output);
    
    const outputBytes = fs.readFileSync(test_output);
    const pdfDoc = await PDFDocument.load(outputBytes);
    const pages = pdfDoc.getPages();
    const {width, height} = pages[0].getSize();

    expect(pages).toHaveLength(2);
    expect(width).toBe(1200);
    expect(height).toBe(600);
   
});

