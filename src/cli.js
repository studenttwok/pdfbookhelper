'use strict'
const commander = require('commander');
const { getPagesBoxInfo, mergeForPrint, chopPages, halfTheWholePages } = require('./index.js');

async function main() {

    commander.program.version('1.0.0')
    .description('PDF tools')
    .usage('[OPTIONS]...')
    .requiredOption('-m, --mode <mode>', 'mode: [info, merge, chop, half, help]', 'help')
    .option('-i, --input <input>', 'input file name')
    .option('-o, --output <output>', 'output file name')
    .option('-c, --chopBox <mode>', 'chopBox: [cropBox, bleedBox, trimBox, artBox, mediaBox]', 'mediaBox')
    .option('-cx, --chopX <XOffset>', 'chop X offset in chop mode')
    .option('-cy, --chopY <YOffset>', 'chop Y offset in chop mode')
    .option('-cw, --chopWidth <width>', 'chop width in chop mode')
    .option('-ch, --chopHeight <height>', 'chop height in chop mode')
    .option('-hsf, --halfSkipFirst', 'skip first page in Half mode', false)
    .option('-hsl, --halfSkipLast', 'skip last page in Half mode', false)

    .parse(process.argv);

    const options = commander.program.opts();
    //console.log(options);

    if (options.mode === "info") {
        const inputFilename = options.input;
        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        await getPagesBoxInfo(inputFilename);

    } else if (options.mode === "merge") {
        const inputFilename = options.input;
        const outputFileName = options.output;
        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        if (!outputFileName) {
            console.log("output file name is required");
            process.exit(1);
        }

        await mergeForPrint(inputFilename, outputFileName);
    } else if (options.mode === "chop") {
        const inputFilename = options.input;
        const outputFileName = options.output;
        const chopBox = options.chopBox;
        const chopObj = {};

        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        if (!outputFileName) {
            console.log("output file name is required");
            process.exit(1);
        }

        if (("chopX" in options) && ("chopY" in options) && ("chopWidth" in options) && ("chopHeight" in options)) {
            chopObj.x = options.chopX;
            chopObj.y = options.chopY;
            chopObj.width = options.chopWidth;
            chopObj.height = options.chopHeight;

            await chopPages(inputFilename, outputFileName, chopObj);

        } else {
            // use chopBox
            await chopPages(inputFilename, outputFileName, chopBox);
        }
    } else if (options.mode === "half") {
        const inputFilename = options.input;
        const outputFileName = options.output;
        const skipFirst = options.halfSkipFirst;
        const skipLast = options.halfSkipLast;

        if (!inputFilename) {
            console.log("input file name is required");
            process.exit(1);
        }
        if (!outputFileName) {
            console.log("output file name is required");
            process.exit(1);
        }

        await halfTheWholePages(inputFilename, outputFileName, skipFirst, skipLast);
    } else {
        // display help
        commander.program.help();
    }

}

if (require.main === module) {
    main();
}
