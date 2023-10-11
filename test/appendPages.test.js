test('mergeForPrint', async () => {
    const fs = require('fs');
    const { appendPages } = require('../src/index');
    const {PDFDocument} = require('pdf-lib');

    const test_input = "./test/assets/sample.pdf";
    const test_output = "./test/assets/appendPages_output.pdf";
    await appendPages(test_input, test_input, test_output, true);
    
    const outputBytes = fs.readFileSync(test_output);
    const pdfDoc = await PDFDocument.load(outputBytes);
    const pageCount = pdfDoc.getPageCount();

    expect(pageCount).toBe(8); // Should be able to ignmore the invalid page index
   
});

