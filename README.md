# NGram Text Generator

This project implements an N-gram-based text generator in TypeScript. The generator is trained on a text file and can produce random text based on the N-gram model.

## How It Works

An N-gram model predicts the next word in a sequence based on the previous `n-1` words. The model is trained on a text file, where it builds a mapping of word sequences to possible next words. Using this mapping, the model generates random text by selecting words probabilistically.

## Requirements

### TypeScript

- [Deno](https://deno.land/) (for running the TypeScript code)

## Usage

1. Install Deno.
2. Place your training data in data.txt.
3. Run the TypeScript script:

    ```bash
    deno run --allow-read main.ts
    ```

    This will train the model on `data.txt` and generate random text.

## Customization

### Changing the N-gram Size

You can change the N-gram size by modifying the `n` parameter when creating the `NGramModel` instance:

```ts
const model = new NGramModel(3); // Bigram model
```

### Using a Different Training File

Replace `data.txt` with the path to your own text file when calling the `train` method.

```ts
await model.train('your_file.txt');
```

### Generating More or Fewer Words

You can specify the number of words to generate by passing a value to the `generate` method:

```ts
console.log(model.generate(100)); // Generate a maximum of 100 words
```

## License

This project is licensed under the MIT License. See [LICENSE.txt](LICENSE.txt)
