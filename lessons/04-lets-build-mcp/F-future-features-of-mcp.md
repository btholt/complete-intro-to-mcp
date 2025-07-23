---
title: "Future Features of MCP"
---

Like we've said before, MCP is really new and evolving quickly. Lots of new features and ideas are being tested out and possibly being adopted while others may fade out as time goes on. We are still learning new ways to harness the power of LLMs, both from a capability perspective as well as an efficiency one.

I wanted to call out three features that are forthcoming from the MCP **client** perspective. Eventually these will probably make their way to Claude Desktop and Tome, but as of today they do not work.

> [Here's a list of MCP clients][clients] and their various levels of support. Only a few support the newer features.

## Roots

This is just a way to expose a subset of your file system to your LLM. For Claude Desktop, it'd be like saying "hey Claude, you have access to any file in this directory" and it would then be able to operate on those files. This somewhat already works in things like Cursor or VS Code because obviously they get to work on the files that are open in the workspace they're in – this is just a way of formalizing that process and giving it a name.

[See more about roots here][roots].

## Sampling

I really don't like the name sampling because what I think sampling is, isn't actually what it is.

Put simply: it's when your MCP server can give the LLM a prompt directly. An example would be if you had an MCP server that helped with refactoring and the MCP server could hand the LLM a piece of code with a prompt on how to refactor it and it would get an answer that way. Very useful stuff.

A critical part is that there is still human in the loop here because we don't want either sneaky MCP servers taking advantage of unwitting users nor do we want an MCP server to go off the rails and accidentally burn a lot of tokens doing worthless work. So what will happen is that when the MCP server goes to prompt your LLM, it will ask you, the human, to approve that prompt, and then once the LLM is done, it will ask you to approve what it will send back to the MCP server. It will also let you edit it directly too!

![Sampling diagram](/images/sampling.jpeg)

<small>Source: [modelcontextprotocol.io docs](sampling)</small>

## Elicitation

Elicitation is a just a fancy word that your MCP server can ask follow up questions.

Think of an a tool that the MCP server could call to ask you to get your full address so it could fill out a form for you or one where it could ask for your specific GitHub username before it generates a report on GitHub usage. There's all sorts of reasons that a tool could need more information from the user. As of now we just have to hope that the LLM is smart enough to correlate this data for us, but this way we can just make it deterministic that correct information gets gathered as specified by the tool.

[clients]: https://modelcontextprotocol.io/clients
[roots]: https://modelcontextprotocol.io/specification/2025-06-18/client/roots
[sampling]: https://modelcontextprotocol.io/specification/2025-06-18/client/sampling
[elicitation]: https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation
