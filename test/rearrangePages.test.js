test('mergeForPrint', async () => {
    const fs = require('fs');
    const { rearrangePages } = require('../src/index');
    const {PDFDocument} = require('pdf-lib');

    const test_input = "./test/assets/sample.pdf";
    const test_output = "./test/assets/rearrangePages_output.pdf";
    const testSeq = [0,1,2,3,4,3,2,1,0];    // 1 baseed
    await rearrangePages(test_input, test_output, testSeq);
    
    const outputBytes = fs.readFileSync(test_output);
    const pdfDoc = await PDFDocument.load(outputBytes);
    const pageCount = pdfDoc.getPageCount();

    expect(pageCount).toBe(7); // Should be able to ignmore the invalid page index
   
});

