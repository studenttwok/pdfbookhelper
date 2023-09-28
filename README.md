# PDFBookHelper

![pdfbookhelper](https://github.com/studenttwok/pdfbookhelper/blob/main/pdfbookhelper.jpg)


A utility that helps to prepare print-ready book pdf. Currently support non-encrypted PDF ONLY.
- Merge two pages into one page for print in bookbinding order.
- Chop pages with mediaBox/chopBox/trimBox/BleedBox/ArtBox, or customized area according to your need.
- Split page into two half pages.
- Show different kinds of boxes.

## NPM
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
For arguments please refer to the help. Here are some example:
```code
npx pdfbookhelper -m info -i input.pdf
npx pdfbookhelper -m merge -i input.pdf -o output.pdf
npx pdfbookhelper -m chop -i input.pdf -o output.pdf -c bleedBox
npx pdfbookhelper -m half -i input.pdf -o output.pdf -hsf -hsl

```

## Code
Import the library by
```code
const {getPagesBoxInfo, mergeForPrint, chopPages, halfTheWholePages} = require("pdfbookhelper");
```
- getPagesBoxInfo (async)
- mergeForPrint (asyn)
- chopPages (async)
- halfTheWholePages (async)


## getPagesBoxInfo
```code
await getPagesBoxInfo( 
	inputFilename 
)
```
inputFilename: string, filepath of the input PDF

Get boxes of pages

Return an array of boxes of each page in page order.

Example:
```code
[
	{
		mediaBox: {x:0, y:0, width:100, height:100 },
		chopBox: {x:0, y:0, width:100, height:100 },
		trimBox: {x:0, y:0, width:100, height:100 },
		bleedBox: {x:0, y:0, width:100, height:100 },
		artBox: {x:0, y:0, width:100, height:100 }
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
	skipFirst = false,
	skipLast = false
)
```
Split page into two half pages

inputFilename: string, filepath of the input PDF

outputFileName: string, filepath of the output PDF

skipFirst: boolean, whether we retain first page during the process

skipLast: boolean, whether we retain last page during the process


Example:

Input PDF Content: [AB],[CD],[EF],[GH]

Output PDF Contet: [A],[B],[C],[D],[E],[F],[G],[H]

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
