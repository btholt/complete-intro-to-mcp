---
title: Streamable HTTP
description: >-
  Brian Holt walks you through building a Streamable HTTP MCP server in Node.js
  with Express, using a single /mcp endpoint and UUID-based sessions for
  client-server communication. The guide contrasts streamable HTTP with SSEs,
  demonstrates a concrete MCP setup (POST for client messages, GET for server
  messages, DELETE to end sessions), and covers scalability and security
  considerations plus inspector usage.
keywords:
  - MCP
  - Model Context Protocol
  - Streamable HTTP
  - Node.js
  - Express
  - session management
---

Mark my words, there is about to be a Cambrian explosion of MCP server frameworks for Node.js that will handle a lot of this plumbing for you. But there isn't yet so we're going to have to do some manual housekeeping of session data. We're also not going to implement this in the most scalable way, but I'll leave that as an exercise to you to do.

So let's talk about how streamable HTTP is different than SSEs. For one, there's just the one endpoint - you don't have to GET to one and POST to the other.

![Streamable HTTP diagram](/images/streamable.png)

The topography of handshakes here is a bit more complicated but at the end you get a resumable session, one endpoint to deal with instead of two, and a server that can be stateless as long you architect it well.

But yeah, the key here is that the server gives the session a UUID as a session ID and then the client refers to that using an HTTP header to make sure that the server and client both understand the ongoing context. That's really it. The idea of SSEs still happens inside of this, but it's only part of the architecture instead of all of it.

We're going to implement our MCP main.js again but instead in `streamable.js` and using Express as our Node.js server. Express is chosen because we really just need minimal HTTP helpers and it's the one everyone gets. You can use Fastify, Next.js or whatever you want here.

```bash
npm i express
```

```javascript
import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import path from "path";
import { fileURLToPath } from "url";
import jobsBasedTools from "./jobs-based-tools.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Map to store transports by session ID
const transports = {};

// Function to create a new MCP server instance
function createMcpServer() {
  const server = new McpServer({
    name: "issues-tracker-server",
    version: "1.0.0",
  });

  // Register jobs-based tools
  jobsBasedTools(server);

  return server;
}

// Handle POST requests for client-to-server communication
app.post("/mcp", async (req, res) => {
  // Check for existing session ID
  const sessionId = req.headers["mcp-session-id"];
  let transport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
        transports[sessionId] = transport;
      },
      // DNS rebinding protection is disabled for MCP Inspector compatibility
      enableDnsRebindingProtection: false,
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };

    const server = createMcpServer();

    // Connect to the MCP server
    await server.connect(transport);
  } else {
    // Invalid request
    res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: No valid session ID provided",
      },
      id: null,
    });
    return;
  }

  // Handle the request
  await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// Handle GET requests for server-to-client notifications via SSE
app.get("/mcp", handleSessionRequest);

// Handle DELETE requests for session termination
app.delete("/mcp", handleSessionRequest);

const PORT = 3100;
app.listen(PORT, () => {
  console.log(`MCP Streamable HTTP Server listening on port ${PORT}`);
  console.log(`Server endpoint: http://localhost:${PORT}/mcp`);
});
```

- Every session needs a UUID to keep track of which session is ongoing. I'm just using node:crypto for this and JS object to keep track of it. This wouldn't scale - every client would need to hit the same client which makes it hard to scale. You'd probably use Redis or something to share state amongst stateless servers to scale this better.
- We need to handle POST for client-to-server messages, GET for server-to-client messages, and DELETE for ending sessions.
- I turned off the DNS rebinding protection so we can use the MCP inspector but this is something you'd leave on in prod. Bascially you don't want people to be able to jack other people's sessions if they're able to guess the UUID, that would be a huge vulnerability. But locally it doesn't matter.
- Beyond this, this should just look like a normal ol' web server which it is. We definitely could have (and probably should have) just built this into our backend.

Let's try it now.

```
npx @modelcontextprotocol/inspector
```

Then in the UI put in `localhost:3100/mcp` to connect to your server. Make sure that you either click the link directly from the CLI or that you bring with you the session token. This is just so one or thing on your network can jack your local MCP session and do weird stuff. Again, it's a powerful tool so we need security to make sure it works okay!

Now you should see our three jobs-based tools in the inspector.

So what are the limitations here?

- Obviously we can't just shell out CLI commands - we're constrained to only what we can do on our server and pass back to the user.
- We have to worry a lot more about security - we don't want to leak other users' data because we did something wrong.

If you want more depth here, [I liked BrightData's blog post on it][brightdata]

[brightdata]: https://brightdata.com/blog/ai/sse-vs-streamable-http
