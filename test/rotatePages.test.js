test('mergeForPrint', async () => {
    const fs = require('fs');
    const { rotatePages } = require('../src/index');
    const {PDFDocument} = require('pdf-lib');

    const test_input = "./test/assets/sample.pdf";
    const test_output = "./test/assets/rotatePages_output.pdf";
    const degree = 180;
    const testSeq = [2];    // 1 baseed
    await rotatePages(test_input, test_output, degree, testSeq);
    
    const outputBytes = fs.readFileSync(test_output);
    const pdfDoc = await PDFDocument.load(outputBytes);
    const pageCount = pdfDoc.getPageCount();

    const angels = pdfDoc.getPages().map((page) => page.getRotation().angle);
    expect(angels).toEqual([0, 180, 0, 0]);
   
});

