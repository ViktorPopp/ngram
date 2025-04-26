// ngram_model.ts

class NGramModel {
  private n: number;
  private ngrams: Map<string, string[]>;
  private starts: string[][];

  constructor(n = 2) {
    this.n = n;
    this.ngrams = new Map();
    this.starts = [];
  }

  async train(filepath: string): Promise<void> {
    const text = await Deno.readTextFile(filepath);
    const lines = text.split('\n');

    for (const line of lines) {
      const tokens = line.trim().split(/\s+/);
      if (tokens.length < this.n) continue;

      this.starts.push(tokens.slice(0, this.n - 1));

      for (let i = 0; i <= tokens.length - this.n; i++) {
        const key = tokens.slice(i, i + this.n - 1).join(' ');
        const nextWord = tokens[i + this.n - 1];

        if (!this.ngrams.has(key)) {
          this.ngrams.set(key, []);
        }
        this.ngrams.get(key)?.push(nextWord);
      }
    }
  }

  generate(maxWords = 50): string {
    if (this.starts.length === 0) {
      return "";
    }

    const current = [...this.randomChoice(this.starts)];
    const output = [...current];

    for (let i = 0; i < maxWords - (this.n - 1); i++) {
      const key = current.join(' ');
      const nextWords = this.ngrams.get(key);

      if (!nextWords || nextWords.length === 0) {
        break;
      }

      const nextWord = this.randomChoice(nextWords);
      output.push(nextWord);

      current.shift();
      current.push(nextWord);
    }

    return output.join(' ');
  }

  setN(newN: number): void {
    this.n = newN;
    this.ngrams.clear();
    this.starts = [];
  }

  private randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

// --- Example usage ---
const model = new NGramModel(3); // Trigram model
await model.train('data.txt');    // Make sure 'data.txt' exists
console.log(model.generate(100)); // Generate 100 words

export { };
