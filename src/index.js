'use strict'

const { PDFDocument, degrees  } = require("pdf-lib");
const fs = require("fs");

const getBookPageIndexSequence = (totalPageNumber) => {
  const processingPageIndexSequence = [];
  let adjustedTotalPageNumber = totalPageNumber;
  if (totalPageNumber % 4 > 0) {
    adjustedTotalPageNumber = totalPageNumber + (4 - (totalPageNumber % 4));
  }
  let left = 0;
  let right = adjustedTotalPageNumber - 1;

  while (left < right) {
    processingPageIndexSequence.push(right--);
    processingPageIndexSequence.push(left++);
    processingPageIndexSequence.push(left++);
    processingPageIndexSequence.push(right--);
  }
  return processingPageIndexSequence;
};

const getPagesBoxInfo = async (inputFilename) => {

  try {
    if (!fs.existsSync(inputFilename)) {
      return null;
    }
  } catch(err) {
    console.error(err);
    return null;
  }

  const existingPdfBytes = fs.readFileSync(inputFilename);

  const pageBoxInfos = [];

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const angle = page.getRotation().angle;

    console.log("========================================");
    console.log("Page: ", i + 1 + "/" + pages.length);
    console.log("Rotate angle: ", JSON.stringify(angle));
    console.log("MediaBox: ", JSON.stringify(page.getMediaBox()));
    console.log("CropBox: ", JSON.stringify(page.getCropBox()));
    console.log("BleedBox: ", JSON.stringify(page.getBleedBox()));
    console.log("TrimBox: ", JSON.stringify(page.getTrimBox()));
    console.log("ArtBox: ", JSON.stringify(page.getArtBox()));
    console.log("========================================");

    const boxes = {
      mediaBox: page.getMediaBox(),
      cropBox: page.getCropBox(),
      bleedBox: page.getBleedBox(),
      trimBox: page.getTrimBox(),
      artBox: page.getArtBox(),
      angle: angle,
    };
    pageBoxInfos.push(boxes);
  }
  return pageBoxInfos;
};

const mergeForPrint = async (
  inputFilename,
  outputFileName = undefined,
  bleedingX = 0,
  bleedingY = 0
) => {

  try {
    if (!fs.existsSync(inputFilename)) {
      return null;
    }
  } catch(err) {
    console.error(err);
    return null;
  }

  if (!outputFileName) {
    console.error("outputFileName is required");
    return null;
  }

  const existingPdfBytes = fs.readFileSync(inputFilename);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const outPdfDoc = await PDFDocument.create();
  const pages = pdfDoc.getPages();

  const rawPageWidth = pages[0].getWidth();
  const rawPageHeight = pages[0].getHeight();
  const pageWidth = rawPageWidth - bleedingX * 2;
  const pageHeight = rawPageHeight - bleedingY * 2;

  const processSequence = getBookPageIndexSequence(pdfDoc.getPageCount());
  const emptyPage = pdfDoc.addPage([rawPageWidth, rawPageHeight]); // Create a tmp blank page
  emptyPage.drawText("");

  // https://pdf-lib.js.org/docs/api/classes/pdfdocument#getpages
  // https://www.prepressure.com/pdf/basics/page-boxes
  for (let i = 0; i < processSequence.length; i = i + 2) {
    const embedPages = [
      pages[processSequence[i]] || emptyPage,
      pages[processSequence[i + 1]] || emptyPage,
    ];

    const embeddedPages = await outPdfDoc.embedPages(
      embedPages,
      [
        {
          left: bleedingX,
          right: embedPages[0].getWidth() - bleedingX,
          bottom: bleedingY,
          top: embedPages[0].getHeight() - bleedingY,
        },
        {
          left: bleedingX,
          right: embedPages[1].getWidth() - bleedingX,
          bottom: bleedingY,
          top: embedPages[1].getHeight() - bleedingY,
        },
      ],
      [
        [1, 0, 0, 1, 0 - bleedingX, 0 - bleedingY],
        [1, 0, 0, 1, pageWidth - bleedingX, 0 - bleedingY],
      ]
    );

    // add to page
    const page = outPdfDoc.addPage([pageWidth * 2, pageHeight]);
    page.drawPage(embeddedPages[0]);
    page.drawPage(embeddedPages[1]);
  }

  const pdfBytes = await outPdfDoc.save();
  fs.writeFileSync(outputFileName, pdfBytes);

  return true;
};

const chopPages = async (inputFilename, outputFileName = undefined, cropBox) => {
  
  try {
    if (!fs.existsSync(inputFilename)) {
      return null;
    }
  } catch(err) {
    console.error(err);
    return null;
  }

  if (!outputFileName) {
    console.error("outputFileName is required");
    return null;
  }

  const existingPdfBytes = fs.readFileSync(inputFilename);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const outPdfDoc = await PDFDocument.create();
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    //let x = y = width = height = 0;
    // we must have mediabox
    let cropFunc = pages[i].getMediaBox;

    if (typeof cropBox === "string" || cropBox instanceof String) {
      if (cropBox === "artBox") {
        cropFunc = pages[i].getArtBox;
      } else if (cropBox === "bleedBox") {
        cropFunc = pages[i].getBleedBox;
      } else if (cropBox === "cropBox") {
        cropFunc = pages[i].getCropBox;
      } else if (cropBox === "trimBox") {
        cropFunc = pages[i].getTrimBox;
      }
    } else if (cropBox instanceof Object) {
      if (cropBox.x && cropBox.y && cropBox.width && cropBox.height) {
        cropFunc = () => {
          return {
            x: cropBox.x,
            y: cropBox.y,
            width: cropBox.width,
            height: cropBox.height,
          };
        };
      }
    }

    const { x, y, width, height } = cropFunc.call(pages[i]);
    const embeddedPage = await outPdfDoc.embedPage(
      pages[i],
      { left: x, right: x + width, bottom: y, top: y + height },
      [1, 0, 0, 1, 0 - x, 0 - y]
    );

    const page = outPdfDoc.addPage([width, height]);
    page.drawPage(embeddedPage);
  }

  const pdfBytes = await outPdfDoc.save();
  fs.writeFileSync(outputFileName, pdfBytes);

  return true;
};

const halfTheWholePages = async (
  inputFilename,
  outputFileName = undefined,
  retainFirst = false,
  retainLast = false
) => {

  try {
    if (!fs.existsSync(inputFilename)) {
      return null;
    }
  } catch(err) {
    console.error(err);
    return null;
  }

  if (!outputFileName) {
    console.error("outputFileName is required");
    return null;
  }

  const existingPdfBytes = fs.readFileSync(inputFilename);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const outPdfDoc = await PDFDocument.create();
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    if ((retainFirst && i == 0) || (retainLast && i == pages.length - 1)) {
      // output the page directly without any change
      const copiedPages = await outPdfDoc.copyPages(pdfDoc, [i]);
      outPdfDoc.addPage(copiedPages[0]);
    } else {
      const halfPageWidth = pages[i].getWidth() / 2;
      const pageHeight = pages[i].getHeight();

      const embeddedPage = await outPdfDoc.embedPages(
        [pages[i], pages[i]],
        [
          {
            left: 0,
            right: halfPageWidth,
            bottom: 0,
            top: pageHeight,
          },
          {
            left: halfPageWidth,
            right: halfPageWidth + halfPageWidth,
            bottom: 0,
            top: pageHeight,
          },
        ],
        [
          [1, 0, 0, 1, 0, 0],
          [1, 0, 0, 1, -halfPageWidth, 0],
        ]
      );
      // add to page
      const page1 = outPdfDoc.addPage([halfPageWidth, pageHeight]);
      page1.drawPage(embeddedPage[0]);
      const page2 = outPdfDoc.addPage([halfPageWidth, pageHeight]);
      page2.drawPage(embeddedPage[1]);
    }
  }

  const pdfBytes = await outPdfDoc.save();
  fs.writeFileSync(outputFileName, pdfBytes);

  return true;
};

const rearrangePages = async (
  inputFilename,
  outputFileName = undefined,
  rearrangedSequence = []
) => {

  try {
    if (!fs.existsSync(inputFilename)) {
      return null;
    }
  } catch(err) {
    console.error(err);
    return null;
  }

  if (!outputFileName) {
    console.error("outputFileName is required");
    return null;
  }

  const existingPdfBytes = fs.readFileSync(inputFilename);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Filter the input seq, make sure it's valid
  // and convert it to 0-based index
  const pageNumbers = pdfDoc.getPageCount();
  const filteredSequence = rearrangedSequence.filter((value, index, self) => {
    return value > 0 && value <= pageNumbers;
  }).map((value) => {
    return value - 1;
  });

  if (filteredSequence.length == 0) {
    console.error("rearrangedSequence is required");
    return null;
  }

  const outPdfDoc = await PDFDocument.create();

  const copiedPages = await outPdfDoc.copyPages(pdfDoc, filteredSequence);
  for (let i=0; i < copiedPages.length; i++) {
    if (copiedPages[i] !== undefined) {
      outPdfDoc.addPage(copiedPages[i]);
    }
  }

  const pdfBytes = await outPdfDoc.save();
  fs.writeFileSync(outputFileName, pdfBytes);

  return true;
}

const appendPages = async (
  inputFilename,
  inputFilename2,
  outputFileName = undefined,
  isPrepend = false
) => {

  try {
    if ((!fs.existsSync(inputFilename)) || (!fs.existsSync(inputFilename2)))  {
      return null;
    }
  } catch(err) {
    console.error(err);
    return null;
  }

  if (!outputFileName) {
    console.error("outputFileName is required");
    return null;
  }

  const existingPdfBytes = fs.readFileSync(inputFilename);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const existingPdf2Bytes = fs.readFileSync(inputFilename2);
  const pdfDoc2 = await PDFDocument.load(existingPdf2Bytes);

  const outPdfDoc = await PDFDocument.create();

  const copiedPages = await outPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
  const copiedPages2 = await outPdfDoc.copyPages(pdfDoc2, pdfDoc2.getPageIndices());

  if (isPrepend) {
    for (let i=0; i < copiedPages2.length; i++) {
      if (copiedPages2[i] !== undefined) {
        outPdfDoc.addPage(copiedPages2[i]);
      }
    }
    for (let i=0; i < copiedPages.length; i++) {
      if (copiedPages[i] !== undefined) {
        outPdfDoc.addPage(copiedPages[i]);
      }
    }
  } else {
    for (let i=0; i < copiedPages.length; i++) {
      if (copiedPages[i] !== undefined) {
        outPdfDoc.addPage(copiedPages[i]);
      }
    }
    for (let i=0; i < copiedPages2.length; i++) {
      if (copiedPages2[i] !== undefined) {
        outPdfDoc.addPage(copiedPages2[i]);
      }
    }
  }

  const pdfBytes = await outPdfDoc.save();
  fs.writeFileSync(outputFileName, pdfBytes);

  return true;
}

const rotatePages = async (
  inputFilename,
  outputFileName = undefined,
  degree = 90,
  pageSequence = []
) => {

  try {
    if (!fs.existsSync(inputFilename)) {
      return null;
    }
  } catch(err) {
    console.error(err);
    return null;
  }

  if (!outputFileName) {
    console.error("outputFileName is required");
    return null;
  }

  if (degree !== 90 && degree !== 180 && degree !== 270) {
    console.log("Degree can only be 90, 180, 270");
    return null;
  }

  const existingPdfBytes = fs.readFileSync(inputFilename);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const outPdfDoc = await PDFDocument.create();

  // Filter the input seq, make sure it's valid
  // and convert it to 0-based index
  const pageNumbers = pdfDoc.getPageCount();
  const filteredSequence = pageSequence.filter((value, index, self) => {
    return value > 0 && value <= pageNumbers && self.indexOf(value) === index
  }).map((value) => {
    return value - 1;
  });

  const copiedPages = await outPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
  //console.log(filteredSequence);
  for (let i=0; i < copiedPages.length; i++) {

      // roate page if needed
      if (filteredSequence.length === 0 || filteredSequence.indexOf(i) > -1) {
        //console.log("Rotate", i);
        const baseDegree = copiedPages[i].getRotation().angle;
        let newDegree = baseDegree + degree;
        if (newDegree >= 360) {
          newDegree = newDegree - 360;
        }
        copiedPages[i].setRotation(degrees(newDegree));
        
      }
      //console.log(copiedPages[i].getRotation().angle);
      outPdfDoc.addPage(copiedPages[i]);
  }

  const pdfBytes = await outPdfDoc.save();
  fs.writeFileSync(outputFileName, pdfBytes);

  return true;
}

module.exports = {
  getPagesBoxInfo,
  mergeForPrint,
  chopPages,
  halfTheWholePages,
  rearrangePages,
  appendPages,
  rotatePages,
};
