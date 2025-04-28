import { readFileSync, readdirSync, writeFileSync } from "fs";
import critterDBToFantasyStatblock from "./critterDBToFantasyStatblock.mjs";

const args = process.argv.slice(2, process.argv.length);
const files = [];
let inputFolder;
let outputFolder =
  "/Users/goncalostratfordandrade/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/D&D 40k/Monsters/Statblocks";

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

if (inputFolder.length) {
  readdirSync(inputFolder).forEach((file) => {
    if (file.split(".")[1] === "json") files.push(file);
  });
}

files.forEach((file) => {
  const filePath = `${inputFolder}/${file}`;
  const fileContent = JSON.parse(readFileSync(filePath, "utf8"));

  // this can look for an option in future. for now it will always run
  const fantasyBlock = critterDBToFantasyStatblock(fileContent);

  writeFileSync(
    `${outputFolder}/${fileContent.name.replace(" ", "-")}.md`,
    fantasyBlock
  );
});

process.exit(0);
