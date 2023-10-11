# CLI
You can use pdfBookHelper in CLI, without the need of coding.

## What You Need

> NodeJS: Download it from https://nodejs.org/en/download.
I recommend selecting an LTS (Long Term Support) version. I tested it with v18, and it works well.

> Basic knowledge of working with files, folders, and using the command prompt (Windows) or Terminal (Mac, Linux).

## Procedure:

1. Prepare Your PDF
Start with the PDF file that you want to work on.
You can rename it to something easy to type, something like "input.pdf."
Save it to a folder of your choice. If you're unsure, save it to your Home folder (e.g., c:\Users\[Username]\ on Windows or /home/[Username]/ on Mac/Linux).

2. Install NodeJS, Invoke the command prompt and Navigate to the Folder
After installing NodeJS, open your command prompt (Windows) or Terminal (Mac, Linux).
Navigate to the folder containing your PDF using the "cd" command. For example "cd c:\tmp" if you placed the file in c:\tmp. If your PDF is already in your home folder, you may already be there and skip this step.

3. Run the pdfbookhelper Command
Type the following command and hit Enter:

npx pdfbookhelper

Follow the on-screen instructions for additional details.

You can always add `--help` to the end of the command to retrieve helping information.

## Common Scenarios
The following examples assume you have the input file "input.pdf" and want the output file to be "output.pdf". Free feel to substitute the value.

### Scenario 1 - Remove White Spaces Between Pages and make it in bookbinding order.
Use this command to merge two pages into one, eliminating unnecessary white spaces between pages, especially useful when printing with duplex A3 printers:

```code
npx pdfbookhelper merge input.pdf output.pdf
```

Example:

Input page: [A],[B ],[C],[D],[E],[F],[G],[H]

Output page: [HA],[BG],[FC],[DE]


### Scenario 2 - Trim Pages
To trim pages based on the trimBox data:

```code
npx pdfbookhelper chop input.pdf output.pdf trimBox
```
Example likes https://boardgamegeek.com/filepage/196322/kanban-ev-official...

**Instead of *trimBox*, you can use cropBox, bleedBox, artBox, mediaBox as well.**


If your PDF has no trimBox data, you can provide your trimBox values. Use the following command to obtain the mediaBox info, as your starting values.

```code
npx pdfbookhelper info input.pdf
```

Then compose and experiment your own trimBox value with the following command:
```code
npx pdfbookhelper chop input.pdf output.pdf -x 10 -y 10 -w 100 -h 100
```

Substitute the numbers after *x y w h* with your experiment values. The trim box is defined by a starting xy coordinates and its width and height. coordinate 0,0 is located at the left bottom. Repeat with different values until you are satisfy with the output.


### Scenario 3 - Divide a Page Evenly
Use this command to split a page evenly:

```code
npx pdfbookhelper half input.pdf output.pdf
```

Example:

Input page: [AB],[CD]

Output page: [A],[B ],[C],[D]

**Sometimes your input may look like this:**

Input page: [A],[BC],[DE],[F]

Example likes https://boardgamegeek.com/thread/3159162/english-rule-book

You can use the following arguments to retain the first/last page in the process:

Add -rf to retain [A]

Add -rl to retain [F]

```code
npx pdfbookhelper half input.pdf output.pdf -rf -rl
```

### Scenario 4 - Rearrange pages
Sometimes you may have the situation that a PDF contains some unwanted pages, or pages are not organised in the desired order.

Use this command to rearrange the pages:

```code
npx pdfbookhelper rearrange input.pdf output.pdf 1 1 2,4,6 8-10
```

Replace page number **1 1 2,4,6 8-10** with your desired. First page is 1. 

You can specify the page ranges with a hyphen and use comma to concat pages.

Example:

Input pages: [A],[B ],[C],[D],[E],[F],[G],[H], [I], [J]

Input sequence: 1 1 2,4,6 8-10

Output pages: [A], [A], [B ], [D], [F], [H], [I], [J]

### Scenario 5 - Append pages
You have two pdf and you want to merge them into one pdf file

```code
npx pdfbookhelper append input.pdf input2.pdf output.pdf
```

You can use ```-th``` to prepend content.

### Scenario 6 - Rotate pages
You want to rotate some pages.

```code
npx pdfbookhelper rotate input.pdf output.pdf 180 2,3
```

The above command with only rotate page 2 and page 3 clockwise 180 degrees. If you want to rotate whole file, just ommit *2,3*.



