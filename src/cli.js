'use strict'
const commander = require('commander');
const { getPagesBoxInfo, mergeForPrint, chopPages, halfTheWholePages, rearrangePages, appendPages, rotatePages } = require('./index.js');

async function main() {
    
    // sub-commands
    const infoCommand = new commander.Command('info');
    infoCommand.description('Get the information of the PDF file')
    .argument('<input>', 'input file name')
    .action(async (inputFilename) => {
        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        await getPagesBoxInfo(inputFilename);
    });

    const mergeCommand = new commander.Command('merge');
    mergeCommand.description('Merge the PDF files')
    .argument('<input>', 'input file name')
    .argument('<output>', 'output file name')
    .action(async (inputFilename, outputFileName) => {
        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        if (!outputFileName) {
            console.log("output file name is required");
            process.exit(1);
        }

        await mergeForPrint(inputFilename, outputFileName);
    });

    const chopCommand = new commander.Command('chop');
    chopCommand.description('Chop the PDF file')
    .argument('<input>', 'input file name')
    .argument('<output>', 'output file name')
    .argument('[chopBox]', 'chopBox: [cropBox, bleedBox, trimBox, artBox, mediaBox]', 'mediaBox')
    .option('-x, --chopX <XOffset>', 'chop X offset in chop mode')
    .option('-y, --chopY <YOffset>', 'chop Y offset in chop mode')
    .option('-w, --chopWidth <width>', 'chop width in chop mode')
    .option('-h, --chopHeight <height>', 'chop height in chop mode')
    .action(async (inputFilename, outputFileName, chopBox, options) => {
        const chopObj = {};

        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        if (!outputFileName) {
            console.log("output file name is required");
            process.exit(1);
        }

        if (
            (("chopX" in options) && ("chopY" in options) && ("chopWidth" in options) && ("chopHeight" in options))
            &&
            (!isNaN(options.chopX) && !isNaN(options.chopY) && !isNaN(options.chopWidth) && !isNaN(options.chopHeight)) 
            ) {
            chopObj.x = parseInt(options.chopX);
            chopObj.y = parseInt(options.chopY);
            chopObj.width = parseInt(options.chopWidth);
            chopObj.height = parseInt(options.chopHeight);

            await chopPages(inputFilename, outputFileName, chopObj);

        } else {
            // use chopBox
            await chopPages(inputFilename, outputFileName, chopBox);
        }
    });

    const halfCommand = new commander.Command('half');
    halfCommand.description('Half the PDF file')
    .argument('<input>', 'input file name')
    .argument('<output>', 'output file name')
    .option('-rf, --retainFirst', 'Retain first page', false)
    .option('-rl, --retainLast', 'Retain last page', false)
    .action(async (inputFilename, outputFileName, options) => {
        const retainFirst = options.retainFirst;
        const retainLast = options.retainLast;

        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        if (!outputFileName) {
            console.log("output file name is required");
            process.exit(1);
        }

        await halfTheWholePages(inputFilename, outputFileName, retainFirst, retainLast);
    });

    const rearrangeCommand = new commander.Command('rearrange');
    rearrangeCommand.description('Rearrange the PDF file')
    .argument('<input>', 'input file name')
    .argument('<output>', 'output file name')
    .argument('<rearrangeSequence...>', 'Desired page sequence, eg: 4-2 1 3,4')
    .action(async (inputFilename, outputFileName, rearrangeSequence) => {
        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        if (!outputFileName) {
            console.log("output file name is required");
            process.exit(1);
        }

        // Parse the rearrangeSequence
        const parsedSeq = [];                

        if (rearrangeSequence.length > 0) {
            for (let i=0; i< rearrangeSequence.length; i++) {
                const content = rearrangeSequence[i].trim();
                // regex to check if the pattern match with \d+-\d+
                const regex = /^\d+-\d+$/;
                const regex2 = /^\d+(,\d+)*$/;
                // check if the content match this regex
                if (regex.test(content)) {
                    const [start, end] = content.split('-');
                    const startI = parseInt(start);
                    const endI = parseInt(end);
                    if (startI < endI) {
                        // Increase
                        for (let j=startI; j<=endI; j++) {
                            parsedSeq.push(j);
                        }
                    } else {
                        // Decrease
                        for (let j=startI; j>=endI; j--) {
                            parsedSeq.push(j);
                        }
                    }
                } else if (regex2.test(content)) {
                    const arr = content.split(',');
                    for (let j=0; j<arr.length; j++) {
                        if (arr[j] === "") {
                            continue;
                        }
                        parsedSeq.push(parseInt(arr[j]));
                    }
                }
            }
        }
        //console.log(parsedSeq);
        await rearrangePages(inputFilename, outputFileName, parsedSeq);
    });

    const appendCommand = new commander.Command('append');
    appendCommand.description('Append the PDF file')
    .argument('<input>', 'Input file name')
    .argument('<appendInput>', 'Input file name to append')
    .argument('<output>', 'Output file name')
    .option('-th, --toHead', 'append the contect to head (Prepend)', false)
    .action(async (inputFilename, appendInputFilename, outputFileName, options) => {
        const appendHead = options.toHead;

        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        if (!appendInputFilename) {
            console.log("append input file name is required");
            process.exit(1);
        }
        if (!outputFileName) {
            console.log("output file name is required");
            process.exit(1);
        }

        await appendPages(inputFilename, appendInputFilename, outputFileName, appendHead);
    });

    const rotateCommand = new commander.Command('rotate');
    rotateCommand.description('Rotate the PDF file')
    .argument('<input>', 'input file name')
    .argument('<output>', 'output file name')
    .argument('[degree]', 'Degree of rotation in clockwise, can only be 90, 180, 270', '90')
    .argument('[pages...]', 'Desired page sequence, eg: 4-2 1 3,4', '')
    .action(async (inputFilename, outputFileName, degree, pages) => {
        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        if (!outputFileName) {
            console.log("output file name is required");
            process.exit(1);
        }
        if (isNaN(parseInt(degree)) || degree !== '90' && degree !== '180' && degree !== '270') {
            console.log("Degree can only be 90, 180, 270");
            process.exit(1);
        }

        degree = parseInt(degree);

        // Parse the pages
        const parsedSeq = [];

        if (pages.length > 0) {
            for (let i=0; i< pages.length; i++) {
                const content = pages[i].trim();
                // regex to check if the pattern match with \d+-\d+
                const regex = /^\d+-\d+$/;
                const regex2 = /^\d+(,\d+)*$/;
                // check if the content match this regex
                if (regex.test(content)) {
                    const [start, end] = content.split('-');
                    const startI = parseInt(start);
                    const endI = parseInt(end);
                    if (startI < endI) {
                        // Increase
                        for (let j=startI; j<=endI; j++) {
                            parsedSeq.push(j);
                        }
                    } else {
                        // Decrease
                        for (let j=startI; j>=endI; j--) {
                            parsedSeq.push(j);
                        }
                    }
                } else if (regex2.test(content)) {
                    const arr = content.split(',');
                    for (let j=0; j<arr.length; j++) {
                        if (arr[j] === "") {
                            continue;
                        }
                        parsedSeq.push(parseInt(arr[j]));
                    }
                }
            }
        }
        //console.log(parsedSeq);
        await rotatePages(inputFilename, outputFileName, degree, parsedSeq);
    });


    commander.program.version('1.1.0')
    .description('PDF Book Helper')
    .addCommand(infoCommand)
    .addCommand(mergeCommand)
    .addCommand(chopCommand)
    .addCommand(halfCommand)
    .addCommand(rearrangeCommand)
    .addCommand(appendCommand)
    .addCommand(rotateCommand)
    .parse(process.argv);

}

if (require.main === module) {
    main();
}
