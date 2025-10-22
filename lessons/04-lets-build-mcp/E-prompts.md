---
description: >-
  Brian Holt explains the difference between prompts and resources in the MCP
  framework and shows how to create and share prompt templates. The guide walks
  you through building an MCP server that uses an Airbnb/Idiomatic.js/Standard
  style guide to generate code-review feedback from an LLM, with steps to
  integrate Claude or Tome for real-time feedback.
keywords:
  - mcp
  - model context protocol
  - prompts
  - resources
  - code review
  - Airbnb style guide
  - Claude
---
This one ends up working fairly similarly to a resource but the idea is that it's a template for a prompt. Imagine you have a common prompt you use a lot and it just needs a little tweak here and there to fit what you're doing. Or you have a team of people that need to share templates between them and you want one place to update it and automatically push it to your colleagues. Or maybe even a company could ship some canned prompts that work well with their tools (e.g. here's a good prompt for working with Neon.com). That's what prompts are for.

> Resources are meant more to be context given to an LLM while prompts are meant more to be commands for the LLM to do. The line is a bit blurry here so don't worry too much about it – I think there are still some iterations left before we land on the exact what MCP servers will work.

Let's build one! Let's say you're having Claude help you write some code and you want it to follow a particular style. You could attach the style guide as a resource (which is a perfectly fine way to do it) or we could do it with prompt. Let's try the prompt.

> We're going back to the old directory we working in, not the issues project. Don't worry, we'll be back to work our issues project shortly.

Feel free to use any style guide you want, but here are a few:

- [Idiomatic.js][idiomatic]
- [Airbnb][airbnb]
- [Standard][standard]

Just copy the entire file into a style-guide.md file in your directory of MCP servers. I think idiomatic is the shortest one if you're looking to save on tokens. Airbnb is certainly the longest, being 4x longer than Standard.

Then let's make a little MCP server for it. Make style-checker.js

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";

const airbnbMarkdownPath = "/Users/brianholt/personal/hello-mcp/airbnb.md";
const airbnbMarkdown = readFileSync(airbnbMarkdownPath, "utf-8");

const server = new McpServer({
  name: "code-review-server",
  version: "1.0.0",
});

server.registerPrompt(
  "review-code",
  {
    title: "Code Review",
    description: "Review code for best practices and potential issues",
    argsSchema: { code: z.string() },
  },
  ({ code }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Please review this code to see if it follows our best practices. Use this Airbnb style guide as a reference:\n\n=============\n\n${airbnbMarkdown}\n\n=============\n\n${code}`,
        },
      },
    ],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

Add your MCP server to Claude and/or Tome, and restart Claude if necessary. Click the ➕, click code-review-server, and paste some code in the box that you want Claude to review. LLM code review! Now, we could just have ESLint do this (and 100% you should do that first) but I could see this being useful giving to an LLM up front that you want it to follow certain patterns and rules or if you want LLM to give you advice on how best to fit code to a style guide. The plain English feedback is super nice.

That's it for prompts!

[idiomatic]: https://github.com/rwaldron/idiomatic.js/blob/master/readme.md
[airbnb]: https://github.com/airbnb/javascript/blob/master/README.md
[standard]: https://github.com/standard/standard/blob/master/RULES.md
