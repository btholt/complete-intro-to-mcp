---
title: "My First MCP Server"
---

Without further ado, let's make our first MCP server!

> We are going to make a local MCP server first, the "old way", or the STDIO way, however you want to label it. We'll do the SSE or the remote way later in the course.

At its most simple, an MCP server is just that, a server. It runs a locally running server that allows you to feed it information via [standard IO][stdio] an LLM can call. In truth, MCP servers are at their core super simple, and you'll probably think it's silly that we wrap them in such a mystique (it is silly.)

It's bit of specialized server as it expects certain input to return certain shapes of responses, but beyond that it's a bog-standard server, so much so that you can literally write your MCP servers in plain Node.js/Bun/Python/whatever.

We'll be using `@modelcontextprotocol/sdk` which is a little toolkit that helps you get started. It's totally necessary as MCP protocol is fairly simple but it just helps us make sure that everything get's tracked the right way.

So create a new directory, do `npm init -y` and run `npm install @modelcontextprotocol/sdk`. In a new file called mcp.js, add

```javascript
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "add-server",
  version: "1.0.0",
});

// Add an addition tool
server.registerTool(
  "add",
  {
    title: "Addition Tool",
    description: "Add two numbers",
    inputSchema: { a: z.number(), b: z.number() },
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
```

- This is as simple an MCP server as you're going to find.
- It registers itself as an MCP server with the `new McpServer` instantiation
- We then add one tool to it, one that adds two numbers together. Obviously an LLM can do this but we're just going for simple here.
- We then specify the transport we're using is stdio, which is using bash's stdin to send info to the MCP server. SSE would be the other kind of transport, and we'll get to that.
- We're also using [Zod][zod] here. Zod is a validation library that's built TypeScript first. It's really useful as you can define what schemas are expected and it serves several purposes.
  - It tells the LLM in strong terms "whatever you give here, it must pass this zod validation. LLMs do well with strong guidelines
  - It's documentation for future you of what this tool call needs.
  - It also allows you to add annotations that tell the LLM "this variable named X expects Y type and in plain English, this variable is Z."

So try starting your server and you'll it'll just do nothing. That's because you need to use stdin to send it commands! Let's try one.

```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {"name": "add", "arguments": {}}}' | node mcp.js | jq
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "add", "arguments": {"a": 5, "b": 3}}}' | node mcp.js
```

- [jq][jq] is super helpful for processing JSON on the command line. It can do a lot more than pretty print but it's 99.99% of what I use it for
- You don't really need to know how to invoke your MCP server via the CLI - your LLM will do it for you. But it helpful for testing! I usually have an LLM write the CLI command for me anyway ♻️
- It's enough to know that you're calling the tools via stdin with a standard format. It passes that it wants to list available tools (which is how LLMs know what is available to use) and then it uses `tools/call` to actually invoke the tool. There's a lot more to MCP but frankly it's low level and really not needed to be known by you. But this is the protocol.

## JSON RPC 2.0

You should see the MCP server respond with an answer of 8! This feels just like writing API endpoints, but the advantage here is that we get to give these tools to LLMs and they can call into code we generate for them. Let's talk a bit about JSON RPC 2.0 which is all this is. [JSON RPC][rpc] is ancient in computing terms with the first version of the spec coming out in 2005. The revised 2.0 version came out and in 2010 and that's what this is using – we're not doing anything wild here, just relying on a very proven set of technology.

So what _is_ JSON RPC? You can think of it as an alternative to REST. With REST you call endpoints that are based around a thing - e.g. you call a PATCH to /users/123 to update user 123. Your URLs are based things and the semantics of manipulating those things. JSON RPC (and XML RPC before it) is based around calling remote functions - that's it. It's literally a remote procedure call. So in this we're just giving an MCP server direction on what procedures (or functions) we want them to do. That's it!

Let's see it inititializes itself!

```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test-client", "version": "1.0.0"}}}' | node mcp.js | jq
```

[stdio]: https://btholt.github.io/complete-intro-to-linux-and-the-cli/streams-and-pipes
[rpc]: https://en.wikipedia.org/wiki/JSON-RPC
[jq]: https://jqlang.org/
[zod]: https://zod.dev/
