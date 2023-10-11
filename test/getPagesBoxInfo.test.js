//import {getPagesBoxInfo, mergeForPrint, chopPages, halfTheWholePages} from 'pdfbookhelper';
//import {getPagesBoxInfo} from 'pdfbookhelper';

test('getPagesBoxInfo', async () => {
    const { getPagesBoxInfo } = require('../src/index');
    const test_input = "./test/assets/sample.pdf";
    const pagesBoxes = await getPagesBoxInfo(test_input);

        expect(pagesBoxes).toHaveLength(4);
        expect(pagesBoxes[0]).toHaveProperty('mediaBox');
        expect(pagesBoxes[0]).toHaveProperty('artBox');
        expect(pagesBoxes[0]).toHaveProperty('bleedBox');
        expect(pagesBoxes[0]).toHaveProperty('cropBox');
        expect(pagesBoxes[0]).toHaveProperty('trimBox');
        expect(pagesBoxes[0]).toHaveProperty('angle');
        expect(pagesBoxes[0].mediaBox.width).toBe(600);
        expect(pagesBoxes[0].mediaBox.height).toBe(600);
        expect(pagesBoxes[0].mediaBox.x).toBe(0);
        expect(pagesBoxes[0].mediaBox.y).toBe(0);

        expect(pagesBoxes[0].artBox.width).toBe(200);
        expect(pagesBoxes[0].artBox.height).toBe(200);
        expect(pagesBoxes[0].artBox.x).toBe(200);
        expect(pagesBoxes[0].artBox.y).toBe(200);
   
});