class NGramModel {
  private n: number;
  private ngrams: Map<string, string[]>;
  private starts: string[][];
  private originalLines: Set<string>;

  constructor(n = 2) {
    this.n = n;
    this.ngrams = new Map();
    this.starts = [];
    this.originalLines = new Set();
  }

  async train(filepath: string): Promise<void> {
    const text = await Deno.readTextFile(filepath);
    const lines = text.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const tokens = trimmed.split(/\s+/);
      if (tokens.length < this.n) continue;

      this.starts.push(tokens.slice(0, this.n - 1));
      this.originalLines.add(trimmed);

      for (let i = 0; i <= tokens.length - this.n; i++) {
        const key = tokens.slice(i, i + this.n - 1).join(" ");
        const nextWord = tokens[i + this.n - 1];

        if (!this.ngrams.has(key)) {
          this.ngrams.set(key, []);
        }
        this.ngrams.get(key)?.push(nextWord);
      }
    }
  }

  generate(maxWords = 50): { text: string; isExactCopy: boolean } {
    if (this.starts.length === 0) {
      return { text: "", isExactCopy: false };
    }

    const current = [...this.randomChoice(this.starts)];
    const output = [...current];

    for (let i = 0; i < maxWords - (this.n - 1); i++) {
      const key = current.join(" ");
      const nextWords = this.ngrams.get(key);

      if (!nextWords || nextWords.length === 0) {
        break;
      }

      const nextWord = this.randomChoice(nextWords);
      output.push(nextWord);

      current.shift();
      current.push(nextWord);
    }

    const generatedText = output.join(" ");
    const isExactCopy = this.originalLines.has(generatedText);

    return { text: generatedText, isExactCopy };
  }

  setN(newN: number): void {
    this.n = newN;
    this.ngrams.clear();
    this.starts = [];
    this.originalLines.clear();
  }

  private randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

const model = new NGramModel(4);
await model.train("data.txt");

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
