import { readFileSync, readdirSync } from "fs";

const args = process.argv.slice(2, process.argv.length);
let inputFolder;
let outputFolder;

args.forEach(function (val) {
  const arg = val.split("=");
  if (arg[0] === "-i") {
    // is input
    inputFolder = arg[1];
  }
  if (arg[0] === "-o") {
    // is output
    outputFolder = arg[1];
  }
});
console.log("🚀 ~ inputFolder:", inputFolder);

if (inputFolder.length) {
  readdirSync(inputFolder).forEach((file) => {
    console.log("🚀 ~ fs.readdirSync ~ file:", file);
  });
}

process.exit(0);
