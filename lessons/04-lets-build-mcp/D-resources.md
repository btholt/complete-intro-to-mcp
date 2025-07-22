We've been working with tools so far, let's go on to resources.

Resources are a bit different than tools. Tools are meant to be given to an LLM and then the LLM can decide to use the tools or not. Think of it like handing a toolbox to your general contractor who is working on your house: they could use one of the tools if they found something that needed it, or if not they just won't use it.

Resources on the other hand are meant for the use to provide to the LLM. This would be more like handing a paper full of information to the contractor and telling them to use it. You decided that you wanted to send it, and you decided what you wanted to put on it.

Frankly, so far, these are _way_ less used than tools. But I can see some occasions they potentially could be. Let's say you have a Dropbox folder full of files that are indeed useful to a project, but you don't want the LLM to be able to access them whenever it wants. You could use a resource to judicially add that context yourself when you want it to be there, but not go as far as to let the LLM do it whenever it wants with a tool.

One thing to note: resouces (or direct resources, as the docs refer to them as) are _not_ dynamic. You can't pass any parameters into it. It's just a static method that gets called and gives back what it gives back. If we were doing a weather resource, you'd have to hardcode in where-ever you were providing weather for.

There is such a thing as "resource templates" where you can provide parameters to the resource, but it's still unsupported in Claude Desktop so we're going to skip it for now.

So, first, we're going to lightly introduce you to our final MCP project here: an issue tracker that I vibe coded 👨‍💻. Think of it like GitHub Issues but with far fewer features.

> [Go clone this repo.][gh]

We'll get more into the tools coding part of this in the next section, but for now let's make a resource from the project.

Make a new folder, `mcp`, and run `npm init -y` in it. Then run `npm i @modelcontextprotocol/sdk@1.16.0 zod@3.25.76`. Note that I specify the version because the MCP SDK is evolving quickly and this is the only way I can assure you my code will work for you. You can always ask Copilot or Cursor to upgrade the code for you.

Add a main.js and put this in there

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

- We'll reuse as this our general MCP server for the issue project so keep this one around
- Most of it shoud look familiar to you already
- `database-schema` is the name of the resource
- `schema://database` is the URI. this gives it a unique identifier that can be used by programs and LLMs to refer to specific resources.
- After that it's mostly just like a tool.
- Resource templates (which are dynamic) are really similar. The biggest difference is their URIs have something like `schema://database/{table}` or something like that and `{table}` becomes the name of the parameter that can be passed in.

Add this MCP server to Claude Desktop and restart it.

Now, click the ➕ button in the text box. You should see the ability to attach a resource. Attach database schema and then ask the LLM `explain my database schema for my issue to me in plain english` or something like that.

That's a resource! This more useful for things like Google Docs where you can easily attach a doc to a request or something of that nature. But they're there and you add them to your MCP servers as you deem necessary!

[gh]: https://github.com/btholt/mcp-issue-tracker
