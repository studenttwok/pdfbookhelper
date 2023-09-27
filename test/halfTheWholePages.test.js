test('halfTheWholePages', async () => {
    const fs = require('fs');
    const { halfTheWholePages } = require('../src/index');
    const { PDFDocument } = require('pdf-lib');

    const test_input = "./test/assets/sample.pdf";
    const test_output1 = "./test/assets/halfTheWholePages_output1.pdf";
    const test_output2 = "./test/assets/halfTheWholePages_output2.pdf";
    const test_output3 = "./test/assets/halfTheWholePages_output3.pdf";

    await halfTheWholePages(test_input, test_output1, false, false);
    await halfTheWholePages(test_input, test_output2, true, false);
    await halfTheWholePages(test_input, test_output3, true, true);
    
    const outputBytes1 = fs.readFileSync(test_output1);
    const pdfDoc1 = await PDFDocument.load(outputBytes1);
    const pdf1Pages = pdfDoc1.getPages();

    const outputBytes2 = fs.readFileSync(test_output2);
    const pdfDoc2 = await PDFDocument.load(outputBytes2);
    const pdf2Pages = pdfDoc2.getPages();

    const outputBytes3 = fs.readFileSync(test_output3);
    const pdfDoc3 = await PDFDocument.load(outputBytes3);
    const pdf3Pages = pdfDoc3.getPages();

    // pdf 1
    expect(pdf1Pages).toHaveLength(8);
    expect(pdf1Pages[0].getSize().width).toBe(300);
    expect(pdf1Pages[0].getSize().height).toBe(600);
    expect(pdf1Pages[1].getSize().width).toBe(300);
    expect(pdf1Pages[1].getSize().height).toBe(600);
    expect(pdf1Pages[7].getSize().width).toBe(300);
    expect(pdf1Pages[7].getSize().height).toBe(600);

    // pdf 2
    expect(pdf2Pages).toHaveLength(7);
    expect(pdf2Pages[0].getSize().width).toBe(600);
    expect(pdf2Pages[0].getSize().height).toBe(600);
    expect(pdf2Pages[1].getSize().width).toBe(300);
    expect(pdf2Pages[1].getSize().height).toBe(600);
    expect(pdf2Pages[6].getSize().width).toBe(300);
    expect(pdf2Pages[6].getSize().height).toBe(600);

    // pdf 3
    expect(pdf3Pages).toHaveLength(6);
    expect(pdf3Pages[0].getSize().width).toBe(600);
    expect(pdf3Pages[0].getSize().height).toBe(600);
    expect(pdf3Pages[1].getSize().width).toBe(300);
    expect(pdf3Pages[1].getSize().height).toBe(600);
    expect(pdf3Pages[5].getSize().width).toBe(600);
    expect(pdf3Pages[5].getSize().height).toBe(600);

   
});

