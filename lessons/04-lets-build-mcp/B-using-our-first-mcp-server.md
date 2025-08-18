---
title: Using Our First MCP Server
description: >-
  Brian Holt walks you through setting up and using an MCP server with Claude
  Desktop and Tome, including the JSON config snippet, how to point your client
  to mcp.js, and steps to verify the model uses the tool. This practical guide
  from Complete Intro to MCP covers model context protocol tools and AI tool
  integration for building powerful AI applications.
keywords:
  - MCP server setup
  - Model Context Protocol
  - Claude Desktop
  - Tome
  - AI tools
  - Brian Holt
---

Now we have a valid MCP server, let's use it!

I'll show you how for both Claude Desktop and Tome but just Google "how do I use MCP server with <my MCP client>" and it should point you to what you need.

> This is also subject to change. In particular I imagine Claude Desktop has to make this way easier to do. But this works as of writing.

## Claude Desktop

Open settings on your Claude Desktop client and go the developers tab. You should see something that will edit your config. It will then probably just point you at the file you need to edit, so open that with VS Code or whatever. Put this in there:

```json
{
  "mcpServers": {
    "demo-server": {
      "command": "[the fully path to your node binary]",
      "args": ["[the full path to your mcp.js file]"],
      "env": {
        "NODE_OPTIONS": "--no-deprecation"
      }
    }
  }
}
```

- Type `which node` to get your node path. Mine is long and weird because I use [fnm][fnm] to manage my Node.js installs. It might be less weird for you.
- In the directory where your mcp.js file is, type `pwd`. Copy that path and then put `/mcp.js` on the end for the args.
- `--no-deprecation` just makes for less noisy logs, particularly if you have dependencies. I think it can confuse Claude too. I see it in every example so I just put it in.

Okay, now restart Claude Desktop (you have to restart it every time you edit the config) and you should now be able to use our MCP server.

## Tome

Tome is much simpler. You just click the MCP logo on the left side and add your command to run your server. You shouldn't need to full Node.js path but you do need the full path to mcp.js. So it'll look like

```bash
node /my/path/to/my/server/mcp.js
```

Or something like that. I don't believe you need to restart Tome, it should just start working.

Let's try it. In either one, run this prompt

```
Using the `add-server` MCP server, use the add tool to add 15 and 21 together.
```

Why so specific? With such a simple use case, many models will just do it themselves and skip calling tools. This ensures that the model will know you want it to use the MCP server. I just ran `add 21 and 15` in both Tome with qwen3:8b and Claude Sonnet 4 and both _did_ choose to use the tool, but that's not always true. In any case, you should see some UI that indicates that a tool was used. If you don't see any UI indicating that then the model elected to not use the tool.

And there you go! That's how you make and consume an MCP server.

[fnm]: https://github.com/Schniz/fnm
