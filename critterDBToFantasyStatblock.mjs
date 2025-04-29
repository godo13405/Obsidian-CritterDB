import { readFileSync } from "fs";

let spells; // placeholder for spells. These come from actions and will need to be extracted. If this var is populated, it will be processed and added to the bottom of the block.

const config = JSON.parse(
  readFileSync("./config.json", "utf8")
).fantasystatblock;

const capitalize = (str) =>
  String(str).charAt(0).toUpperCase() + String(str).slice(1);
const sizeDictionary = (size) => {
  const dictionary = {
    T: "Tiny",
    S: "Small",
    M: "Medium",
    L: "Large",
    H: "Huge",
    G: "Gargantuan",
  };

  return dictionary[size];
};
const alignmentDictionary = (alignment) => {
  const dictionary = {
    C: "Chaotic",
    L: "Lawful",
    N: "Neutral",
    E: "Evil",
    G: "Good",
    U: "Unaligned",
    A: "Any",
  };
  const output = [];
  alignment.forEach((i) => {
    if (dictionary[i]) {
      output.push(dictionary[i]);
    }
  });

  return output.join(" ");
};
const statsDictionary = (input) => {
  const dictionary = {
    str: "Strength",
    dex: "Dexterity",
    con: "Constitution",
    int: "Intelligence",
    wis: "Wisdom",
    cha: "Charisma",
  };
  return dictionary[input];
};

const savesBuilder = (input) => {
  let output = [];
  Object.keys(input).forEach((v) => {
    output.push(`
  - ${statsDictionary(v)}: ${input[v]}`);
  });

  return output.join("");
};
const skillsavesBuilder = (input) => {
  let output = [];
  Object.keys(input).forEach((v) => {
    output.push(`
  - ${capitalize(v)}: ${input[v]}`);
  });

  return output.join("");
};

const buildSpellcasting = (input) => {
  const output = [];
  const spellList = input.split("\n\n")[1].split("\n"); // spell list

  spellList.map((level) => {
    output.push(
      `- ${level.split(": ")[0]}: ${level
        .split(": ")[1]
        .replace(/<[^>]*>/gm, "")}`
    );
  });

  return output.join("\n");
};

const actionsBuilder = (input) => {
  const output = [""];
  input.forEach((action) => {
    // check for spellcasting
    if (action.name.includes("Spellcasting")) {
      spells = buildSpellcasting(action.entries.join("\n"));
    } else {
      output.push(`- name: "${action.name}"`);
      output.push(`  desc: "${action.entries.join("\n")}"`);
    }
  });

  return output.join("\n");
};

const critterDBToFantasyStatblock = (input) => {
  let output = [`\`\`\`statblock`];

  if (input.fluff.entries.length)
    output.unshift(input.fluff.entries.join("\n"));

  // add config
  if (config) {
    Object.keys(config).forEach((k) => {
      output.push(`${k}: ${config[k]}`);
    });
  }

  if (
    input.fluff.images.length &&
    !input.fluff.images[0].href.url.includes(
      "https://encrypted-tbn0.gstatic.com/images?q=" // This is the placeholder critterDB uses, we don't want it
    )
  )
    output.push(`image: "${input.fluff.images[0].href.url}"`);
  if (input.name) output.push(`name: "${capitalize(input.name)}"`);
  if (input.size) output.push(`size: "${sizeDictionary(input.size)}"`);
  if (input.type) output.push(`type: "${capitalize(input.type)}"`);
  if (input.subtype) output.push(`subtype: "${capitalize(input.subtype)}"`);
  if (input.alignment)
    output.push(`alignment: "${alignmentDictionary(input.alignment)}"`);
  output.push(`ac: ${input.ac[0].ac}`);
  output.push(`cr: ${input.cr}`);
  output.push(`hp: ${input.hp.average}`);
  output.push(`hit_dice: ${input.hp.formula.split(" ")[0]}`);
  if (input.speed) output.push(`speed: "${input.speed.walk} ft."`);
  output.push(
    `stats: [${input.str},${input.dex},${input.con},${input.int},${input.wis},${input.cha}]`
  );
  if (Object.keys(input.save).length)
    output.push(`saves: ${savesBuilder(input.save)}`);
  if (Object.keys(input.skill).length)
    output.push(`skillsaves: ${skillsavesBuilder(input.skill)}`);
  if (input.senses) output.push(`senses: "${input.senses.join(`, `)}"`);
  if (input.languages)
    output.push(`languages: "${input.languages.join(`, `)}"`);
  if (input.trait) output.push(`traits: ${actionsBuilder(input.trait)}`);
  if (input.action) output.push(`actions: ${actionsBuilder(input.action)}`);
  if (spells) output.push(`spells:\n${spells}`);
  output.push("```");

  spells = null; // resetting spells
  return output.join(`\n`);
};

export default critterDBToFantasyStatblock;
