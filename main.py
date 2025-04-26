import random
from collections import defaultdict

class NGramModel:
    def __init__(self, n=2):
        self.n = n
        self.ngrams = defaultdict(list)
        self.starts = []

    def train(self, filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                tokens = line.strip().split()
                if len(tokens) < self.n:
                    continue
                self.starts.append(tuple(tokens[:self.n-1]))
                for i in range(len(tokens) - self.n + 1):
                    key = tuple(tokens[i:i+self.n-1])
                    next_word = tokens[i+self.n-1]
                    self.ngrams[key].append(next_word)

    def generate(self, max_words=50):
        if not self.starts:
            return ""
        
        current = random.choice(self.starts)
        output = list(current)

        for _ in range(max_words - (self.n - 1)):
            next_words = self.ngrams.get(current)
            if not next_words:
                break
            next_word = random.choice(next_words)
            output.append(next_word)
            current = tuple(output[-(self.n-1):])
        
        return ' '.join(output)

    def set_n(self, new_n):
        self.n = new_n
        self.ngrams.clear()
        self.starts.clear()

# Example usage:
if __name__ == "__main__":
    model = NGramModel(n=3)         # Start with trigram
    model.train('data.txt')         # Assuming you have a "data.txt" file
    print(model.generate(100))      # Generate 100 words
