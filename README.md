# PDFBookHelper

![pdfbookhelper](https://github.com/studenttwok/pdfbookhelper/blob/main/pdfbookhelper.jpg)

![pdfbookhelper](https://github.com/studenttwok/pdfbookhelper/blob/main/intro.jpg)

A utility that helps to prepare print-ready booklet pdf. Currently support non-encrypted PDF ONLY.
- Merge two pages into one page for print in bookbinding order.
- Chop pages with mediaBox/chopBox/trimBox/BleedBox/ArtBox, or customized area according to your need.
- Split page into two half pages.
- Show different kinds of boxes.

## NPM
![NPM Repo](https://www.npmjs.com/package/pdfbookhelper)
```code
npm install -g pdfbookhelper
```

## Clone and Build
```code
git clone https://github.com/studenttwok/pdfbookhelper
cd pdfbookhelper
npm run test
npm run build
npm run dev
```

## CLI
You can use this helper in CLI
```code
npx pdfbookhelper
```
For arguments please refer to the help. Here are some examples:
```code
npx pdfbookhelper info input.pdf
npx pdfbookhelper merge input.pdf output.pdf
npx pdfbookhelper chop input.pdf output.pdf bleedBox
npx pdfbookhelper half input.pdf output.pdf -rf -rl
npx pdfbookhelper rearrange input.pdf output.pdf 1-3 5,6,8 9
npx pdfbookhelper appeend input.pdf input2.pdf output.pdf
npx pdfbookhelper rotate input.pdf output.pdf 90

```

## Code
Import the library by
```code
const { getPagesBoxInfo, mergeForPrint, chopPages, halfTheWholePages, rearrangePages, appendPages, rotatePages } = require("pdfbookhelper");
```
- getPagesBoxInfo (async)
- mergeForPrint (asyn)
- chopPages (async)
- halfTheWholePages (async)
- rearrangePages (async)
- appendPages (async)
- rotatePages (async)


## getPagesBoxInfo
```code
await getPagesBoxInfo( 
	inputFilename 
)
```
inputFilename: string, filepath of the input PDF

Get boxes of pages

Return an array of boxes andd orientation angle (degree) of each page in page order.

Example:
```code
[
	{
		mediaBox: {x:0, y:0, width:100, height:100 },
		chopBox: {x:0, y:0, width:100, height:100 },
		trimBox: {x:0, y:0, width:100, height:100 },
		bleedBox: {x:0, y:0, width:100, height:100 },
		artBox: {x:0, y:0, width:100, height:100 },
		angle: 0,
	},
	...
]
```

### mergeForPrint
```code
await mergeForPrint(  
	inputFilename,
	outputFileName,
	bleedingX = 0,
	bleedingY = 0
)
```
Create pdf with pages in book order

inputFilename: string, filepath of the input PDF

outputFileName: string, filepath of the output PDF

bleedingX: width offset of the page that you want to crop away during merge process

bleedingY: height offset of the page that you want to crop away during merge process


Example:

Input PDF Content: [A],[B],[C],[D],[E],[F],[G],[H]

Output PDF Contet: [HA],[BG],[FC],[DE]


### chopPages
```code
await chopPages(
	inputFilename, 
	outputFileName, 
	cropBox
)
```
Chop pages with specific area

inputFilename: string, filepath of the input PDF

outputFileName: string, filepath of the output PDF

cropBox: Either string of "artBox", "bleedBox", "cropBox", "trimBox", "mediaBox", or object with the following structure {x, y, width, height}


### halfTheWholePages
```code
await halfTheWholePages(
	inputFilename,
	outputFileName,
	retainFirst = false,
	retainLast = false
)
```
Split page into two half pages

inputFilename: string, filepath of the input PDF

outputFileName: string, filepath of the output PDF

retainFirst: boolean, whether we keep first page unchanged in the process

retainLast: boolean, whether we keep last page unchanged in the process


Example:

Input PDF Content: [AB],[CD],[EF],[GH]

Output PDF Contet: [A],[B],[C],[D],[E],[F],[G],[H]


### rearrangePages
```code
await rearrangePages(
	inputFilename,
	outputFileName,
	rearrangedSequence = [],
)
```
Rearrange pages of PDF

inputFilename: string, filepath of the input PDF

outputFileName: string, filepath of the output PDF

rearrangedSequence: array of integer, page Numbers(1-based), in desired order


Example:

Input PDF Content: [A],[B],[C],[D],[E],[F],[G],[H]

Input rearrangedSequence: [1,3,3,4,2]

Output PDF Contet: [A],[C],[C],[D],[B]


### appendPages
```code
await appendPages(
	inputFilename,
	inputFilename2,
	outputFileName,
	toHead = false,
)
```
Merge two input pdf files and save as a new file

inputFilename: string, filepath of the input PDF

inputFilename2: string, filepath of another input PDF

outputFileName: string, filepath of the output PDF

toHead: boolean, whether the content of inputFilename2 should be insert into head


Example:

Input PDF Content: [A],[B],[C],[D]

Input PDF Content2: [E],[F],[G],[H]

Input toHead : true

Output PDF Contet: [E],[F],[G],[H],[A],[B],[C],[D]

### rotatePages
```code
await rotatePages(
	inputFilename,
	outputFileName,
	degree,
	pageSequence = [],
)
```
Rotate specified pages in 90/180/270 degrees clockwise

inputFilename: string, filepath of the input PDF

outputFileName: string, filepath of the output PDF

degree: integer, degree of clockwise rotation, either 90, 180, 270.

pageSequence: array of integer, page Numbers(1-based) of which want the rotation applied on. If the array is empty, rotate all pages.


Example:

Input PDF Orientation: [90], [0], [90], [90]

Input degree: 180

Input pageSequence: [2]

Output PDF Orientation: [90] , [180], [90], [90]


## Dependencies
- PDF-LIB (https://pdf-lib.js.org/)
- Commander.js (https://github.com/tj/commander.js)

## Dev Dependencies
- jest (https://jestjs.io/)
- rollup (https://rollupjs.org/)
- rollup-plugin-terser (https://rollupjs.org/)

## License
MIT

## Issues
Please report. If you would like to contribute, PR is welcome.
