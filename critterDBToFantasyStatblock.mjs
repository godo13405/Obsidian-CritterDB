import { readFileSync } from "fs";

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

const actionsBuilder = (input) => {
  const output = [""];
  input.forEach((action) => {
    output.push(`- name: "${action.name}"`);
    output.push(`  desc: "${action.entries.join("\n")}"`);
  });

  return output.join("\n");
};

const critterDBToFantasyStatblock = (input) => {
  let output = [`\`\`\`statblock`];

  // add config
  if (config) {
    Object.keys(config).forEach((k) => {
      output.push(`${k}: ${config[k]}`);
    });
  }
  output.push(`layout: Basic 5e Layout`);
  if (input.fluff.images.length)
    output.push(`image: "${input.fluff.images[0].href.url}"`);
  if (input.name) output.push(`name: "${capitalize(input.name)}"`);
  if (input.size) output.push(`size: "${sizeDictionary(input.size)}"`);
  if (input.type) output.push(`type: "${capitalize(input.type)}"`);
  if (input.subtype) output.push(`subtype: "${capitalize(input.subtype)}"`);
  if (input.alignment)
    output.push(`alignment: "${alignmentDictionary(input.alignment)}"`);
  output.push(`ac: ${input.ac[0].ac}`);
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

  output.push("```");

  return output.join(`\n`);
};

export default critterDBToFantasyStatblock;
