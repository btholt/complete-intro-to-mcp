---
title: "MCP Server Design"
---

We are going to do a real project now: an MCP server for an [issue tracker][issue]!

> Generally I avoid mass-use of AI in my courses but I feel it worthwhile to disclose that I "vibe" coded this app. It felt like it fit within the theme of the course and I wanted a fairly robust app with a frontend so you could see the changes happening in real time. There also may be AI generated bugs too! Feel free to code or "vibe" some PRs to fix them!

We started into using this app a bit earlier to learn about resources but let's just recap here.

1. Git clone the app locally
1. Run `npm install` in the root, frontend, and backend directories
1. Feel free to run `npm run dev` from the root directory to get both backend and frontend running and check it out at [http://localhost:5173]()
1. Create an mcp directory in the root directory
1. In the mcp directory run `npm init -y`
1. Then run `npm i @modelcontextprotocol/sdk@1.16.0 zod@3.25.76`
1. Add `"type": "module"` to the package.json
1. Finally, create a file called called main.js and put this in there.

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an MCP server
const server = new McpServer({
  name: "issues-server",
  version: "1.0.0",
});

// Register the database schema resource
server.registerResource(
  "database-schema",
  "schema://database",
  {
    title: "Database Schema",
    description: "SQLite schema for the issues database",
    mimeType: "text/plain",
  },
  async (uri) => {
    const dbPath = path.join(__dirname, "..", "backend", "database.sqlite");

    const schema = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

      db.all(
        "SELECT sql FROM sqlite_master WHERE type='table' AND sql IS NOT NULL ORDER BY name",
        (err, rows) => {
          db.close();
          if (err) reject(err);
          else resolve(rows.map((row) => row.sql + ";").join("\n"));
        }
      );
    });

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/plain",
          text: schema,
        },
      ],
    };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
```

This will get you to a spot where we can start coding our MCP server for our issues app.

## The App

The app is a very basic issue tracker where issues can be CRUD'd. Issues have titles, IDs, assigned persons, tags, status, priority, and created by users.

Ideally, we can connect our app to Claude Desktop via MCP server so that we can be working with Claude and say "hey, this is a good thing to track. Create a high priority ticket and assign it to Jane Smith" and the LLM can just handle the rest. I'm sure you can see the value of being able to interact with your issue system conversationally and in context.

So what all do we need to worry about?

- Auth. Claude needs to be able to act on behalf of us.
- Order of operations. We need an issue to an exist before we can update it.
- Correct tags/people/etc. to assign to issues. We don't want "bug", "bugs", "issues", "prod-issue", and a trillion variations. We want one "bug" tag.

As you can see, there's a lot to juggle here, and it's trusting an LLM a lot to just say "here Claude, use the API directly". Inevitably it's going to mess up a lot. Instead of just wrapping our API directly, we're going to make an MCP server that covers entire "jobs to do" instead of API steps. So we're going to make a tool that "creates a ticket, assigns a user, and gives a correct label to it" instead of just hoping that Claude can get the sequence of API calls right.

Let's go give it a shot!

[issue]: https://github.com/btholt/mcp-issue-tracker
