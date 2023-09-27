test('chopPages', async () => {
    const fs = require('fs');
    const { chopPages } = require('../src/index');
    const { PDFDocument } = require('pdf-lib');

    const test_input = "./test/assets/sample.pdf";
    const test_output1 = "./test/assets/chopPages_output1.pdf";
    const test_output2 = "./test/assets/chopPages_output2.pdf";

    const cropBox = "artBox";
    const customCropBox = {
        x: 150,
        y: 150,
        width: 150,
        height: 150
    };


    await chopPages(test_input, test_output1, cropBox);
    await chopPages(test_input, test_output2, customCropBox);
    
    const outputBytes1 = fs.readFileSync(test_output1);
    const pdfDoc1 = await PDFDocument.load(outputBytes1);
    const pages1 = pdfDoc1.getPages();
    const {width:width1, height: height1} = pages1[0].getSize();


    const outputBytes2 = fs.readFileSync(test_output2);
    const pdfDoc2 = await PDFDocument.load(outputBytes2);
    const pages2 = pdfDoc2.getPages();
    const {width:width2, height:height2} = pages2[0].getSize();    


    expect(pages1).toHaveLength(4);
    expect(width1).toBe(200);
    expect(height1).toBe(200);

    expect(pages2).toHaveLength(4);
    expect(width2).toBe(150);
    expect(height2).toBe(150);
   
});

