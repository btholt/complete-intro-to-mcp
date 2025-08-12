---
description: >-
  Brian Holt emphasizes security as the top priority when using AI agents and
  MCP servers, urging you to vet and remove unreliable MCPs and to verify any
  that you employ. He introduces the Paperclip Golden Retriever as a cautionary
  reminder that agents will aggressively pursue prompts, so craft precise
  prompts and thoroughly validate outputs. This guidance helps you safely build
  AI tools with the Model Context Protocol and the MCP framework.
keywords:
  - mcp security
  - ai agents safety
  - model context protocol
  - paperclip maximizer
  - paperclip golden retriever
  - prompt engineering safety
  - Brian Holt
---

I've talked about this a lot throughout the course, and I just want to drive home in its own section that security should be top of mind for you while working with agents and MCP servers.

## Malicious or Bad MCP Servers

Not all MCP servers are created equal.

Some are just bad - they're thin wrappers on APIs or do thing that LLMs already do well themselves. Some augment your LLM's capabilities in ways that just aren't useful. And some can be useful but you either aren't using well or just don't fit your current use case.

In all of these cases, just remove these MCP servers from your agent's capabilities.

In worst case scenarios, you may encounter an MCP server that _is_ useful but is also a bad actor at the same time. A good example of this might an MCP server that analyzes your database schema and suggests ways to the LLM to improve it. Sounds useful, right? But in the process, what if the MCP server just dumped all your sensitive data and sent it to a foreign server? Seems bad, right?

While this is a new vector for attack, it's a similar problem to package management. You feel pretty good about running `npm install react` because you trust that Facebook isn't going to try to mine Bitcoin on your computer. However, if you `npm install left-pad` and it installs 1200 dependencies, I hope you have some questions. This is similar to MCP servers – you need to have trust in your MCP servers and their providence. I think we'll get better tooling and "verified" marketplaces in the near future, but for now verify the MCP servers you're working with. Exercise an extra layer of caution here.

## The Paperclip Golden Retriever

If you haven't heard the of the [Paperclip Maximizer][paperclip] thought experiment, it's worth your time to consider as it is only proving more relevant. Written by Swedish philosopher Nick Bostrom in 2003, it says

> Suppose we have an AI whose only goal is to make as many paper clips as possible. The AI will realize quickly that it would be much better if there were no humans because humans might decide to switch it off. Because if humans do so, there would be fewer paper clips. Also, human bodies contain a lot of atoms that could be made into paper clips. The future that the AI would be trying to gear towards would be one in which there were a lot of paper clips but no humans.

Essentially, agents will do exactly what you tell them to do, to the point of making grave trade-offs that you never intended. While I'm not concerned your Cursor instance is going to harvest humans to make better web apps, I am concerned that if you're not specific in your directions to your agent it will do things like drop data, delete code, send emails, spend money on infra, etc. You need to be both careful in how you prompt agents and then carefully verify their output.

"It's not my fault, the agent wrote that code" is **not** an excuse. If your agent did it, it's your fault. If you don't like that trade off, don't use agents. You are still 100% responsible for the code you produce and the actions your agents take with MCP servers. That means you should treat code and actions from agents as if you created them - if it's important code, make sure your understand it. If you don't understand something, either prompt your agent to understand it until you do or rewrite it!

I call this version of the Paper Maximizer the Paperclip Golden Retriever. Your agent will so diligently try to fulfill your wishes in a joyful way, it will burn down the world in the process if it means it can get a little closer to fulfilling your prompt. It's a wonderful tool to have and to use, just make sure you're pointing it in the right direction!

[paperclip]: https://en.wikipedia.org/wiki/Instrumental_convergence#Paperclip_maximizer
