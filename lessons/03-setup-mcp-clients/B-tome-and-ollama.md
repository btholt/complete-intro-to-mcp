---
description: >-
  Brian Holt explains practical options for running tool-enabled LLMs within the
  MCP framework, including Tome (an open-source chat app supporting OpenAI and
  Google Gemini) and Ollama for local model hosting, with guidance on selecting
  tool-capable models and managing GPU/CPU inference costs. It also highlights
  OpenRouter and the Tome Discord community for easy model switching within MCP.
keywords:
  - Tome
  - Ollama
  - tools calling
  - OpenRouter
  - MCP
  - AI agents
  - Brian Holt
---
I wanted to give you a second option if for whatever reason you don't want to use Claude Desktop. Again, there are a myriad of choices but I was particularly impressed with [Tome][tome]. Tome is an open source app to chat with LLMs. It supports OpenAI, Google Gemini, and Ollama - so if you want to use either OpenAI or Gemini, here's the place to do it.

> Note that Tome only (as of writing) supports tools, not prompts or resources. But honestly tools are the most important and fun anyway.

You can also run models locally on your computer using [Ollama][ollama]. Ollama is a very cool piece of software that makes it's trivial to run models on your computer. It will spin a local web server for you to make queries against. We can have our Tome then query that locally-running LLM.

Keep in mind that the larger, "smarter" models typically require beefy GPUs to run with any sort of speed. That said, there are some models that run on even just CPUs and can still do tools calling.

> New models are coming out at break-neck pace. By the time you read this versus when I wrote it, I guarantee there will be several cycle of new models available. You will have to select one based on what's available. The good news is that the new ones are only getting more performant and "smarter".

What's important is that you select a model that can handle [tools calling][tools]. As of writing, a few good options that run on less-capable hardware

- [DeepSeek R1 1.5B][r1]
- [Qwen3 0.6B][qwen]
- [Phi4-Mini 3.8B][phi]
- [Llama 3.2 1B][llama]

The B means billions and it's how many parameters that model has which (_very roughly_) can translate to how smart it is, sorta like how megahertz _very roughly_ translates to how capable a CPU is – they're loosely related but you shouldn't say that the Llama model is smarter than the DeepSeek one just because it has more parameters.

You may need to try a few models before you find one that works well with what you're doing. Just make sure you're using tools-calling models as not all of them do it. I at home run Ollama on my gaming PC so I can take advantage of the beefy GPU I have in there - you can definitely do that too since Ollama is just a web server. In that case you can run a larger model as it will fit in VRAM.

Again, keep in mind that running inference on a model is very computationally expensive so you shouldn't expose it to the world and you should be aware that if you run a lot of inference you can rack up a power bill!

> With Tome it doesn't show you streaming text while it's thinking so if you picked a big model that's a bit slower to run, it can look like it's not doing anything.

I asked the creators of Tome if they wanted to share anything with you all and they said if you're passionate about LLMs, agents, and/or MCP servers to join them on [Discord][discord]!

> I'll put one shoutout in here for [OpenRouter.ai][openrouter]. If you want to try a lot of models and make it easy to switch between them, OpenRouter makes that very simple to do. Lots of other services exist (including on Databricks!) but OpenRouter works very well in this use case.

[tome]: https://gettome.app
[discord]: https://discord.com/invite/9CH6us29YA
[ollama]: https://ollama.com/
[tools]: https://ollama.com/search?c=tools
[qwen]: https://ollama.com/library/qwen3
[r1]: https://ollama.com/library/deepseek-r1
[phi]: https://ollama.com/library/phi4-mini
[llama]: https://ollama.com/library/llama3.2
[openrouter]: https://openrouter.ai/
