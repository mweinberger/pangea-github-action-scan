# Pangea LLM Code Scan
example were testing from 'langchain'
Use this action to run regex and detect AI/LLM package imports without AI/LLM security imports
## Inputs

There are two required input parameters:
1. Matrix of AI/LLM package imports
2. Matrix of AI/LLM security package imports

```yml
matrix:
        AI: ["openai","langchain", "@cloudflare/workers-ai", "@aws-sdk/client-bedrock", "@huggingface/transformers", "cohere-ai", "anthropic", "stability-ai", "@pinecone-database/pinecone", "@vercel/ai", "grok-js", "@google/gemini"]

...

with:
        text: ${{matrix.AI}}
```

## Usage

Minimal example

```yml
name: "scan-on-pull"
on:
  pull_request_target:
    types: [opened]
jobs:
  testforLLM:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        AI: ["openai","langchain", "@cloudflare/workers-ai", "@aws-sdk/client-bedrock", "@huggingface/transformers", "cohere-ai", "anthropic", "stability-ai", "@pinecone-database/pinecone", "@vercel/ai", "grok-js", "@google/gemini"]
    steps:
    - uses: actions/checkout@v4
    - uses: ./
      with:
        text: ${{matrix.AI}}
```

## License

[MIT](LICENSE)
