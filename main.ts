import { NGramModel } from "./ngram.ts"; // Adjust the path as needed

const model = new NGramModel(4);
await model.train("data/english.txt");

let originalCount = 0;
const totalCount = 100;
const originals: string[] = [];
const copies: string[] = [];

for (let i = 0; i < totalCount; i++) {
  const result = model.generate(50);
  if (result.isExactCopy) {
    copies.push(result.text);
    originalCount++;
  } else {
    originals.push(result.text);
  }
}

// Print copied texts
//console.log("\n\nCopied texts:");
//for (const text of copies) {
//  console.log(text);
//}

// Print original texts
console.log("\n\nGenerated (original) texts:");
for (const text of originals) {
  console.log(text);
}

console.log(
  `\n\nOut of ${totalCount}, ${originalCount} were exact copies from the dataset.`,
);

export {};
