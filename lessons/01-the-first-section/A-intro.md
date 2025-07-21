# Outline

## AI

- AI, and it's new role in software development
- AI and how it intersects with software dev
  - Using an LLM as a general helper
  - Using LLM-infused development flows like Cursor
  - How to wade into AI for newcomers
- What is an agent, and why they need the ability to interact with an external service

## Set up

- Clients
  - Claude Desktop is easiest
  - Notes on how to do it with Ollama
- Servers
  - Neon?
  - What other MCP servers could I put here?
- Coding editors
  - Let's try Cursor
  - Notes on VS Code / Windsurf

## Let's code an MCP server

- Tools
  - Hello world
  - open-meteo.com
- Resource
  - SQLite schema
- Prompt
  -

## Why MCP was necessary

- We have AI, and want to augment its capabalities beyond just chat. We need tools
- How would you do it now? Let's try and build it with an API.
  - Problem #1 - "Create a high priority issue for the login page and assign to frontend team"
    - Search for high priority and bug tags
    - Search for frontend team
    - Create issue
    - Attach tags
    - Assign frontend team
    - The AI _might_ get it but probably won't get all the steps right
    - The fix: an atomic tool call that does the thing that you want
  - Problem #2 - "Show me all frontend issues and use emojis to express how urgent they are"
    - It needs to fetch from the API and _hopefully_ it parses the JSON correctly
    - Removing the strict requirements of your AI agent understanding JSON and its strict nature is only going to help it
  - Problem #3 - "Give me all issues assigned to me"
    - Relying on agents to do auth is a nightmare and frequently won't work.
  - Problem #4 - "Providing context on API calls"
    - You either need to somehow say "this API does this" or otherwise document what APIs do. MCP just does this for as part of making it.
- Hands-on: let's try to make an MCP server make several sequential calls of an API

## How to make an MCP server with tools

- What MCP servers expect
- SSE vs stdio (we'll cover both)
- The steps
  - Handshake
  - Capabilities discovery
  - Lifecycle
- Tool definitions (server)
- Tool invokations (client)
- Prompts - templates for AI interactions
- Hands-on: let's grab an existing MCP server and watch the interactions
- Take-aways
  - MCP is not magic. In fact it's kinda brain-dead simple.
  - It's really just a protocol in JSON
  - It's meant to be discoverable so AIs can learn what actions they can do
  - It's in fact stateful
  - It uses JSON-RPC 2.0
- Let's build an MCP server and get Ollama / Claude to use it
  - Hands-on: The create issue API example above, let's build a little Node.js server that does the right thing and then expose that as a tool

## Remote vs Local MCP

- STDIO vs SSE
- Remote vs Local

## Let's vibe with MCP

- Let's open Cursor.
- Let's add some MCP servers
  - Hands-on: Maybe the Neon MCP server?
  - Maybe Playwright?
  - https://github.com/punkpeye/awesome-mcp-servers
- Let's try the one we created
  - Hands-on: Have Cursor manage some issues for us.
- Let's try with Claude Desktop
  - Hands-on: Add our MCP server and have Claude read and create issues for us.

## MCP Tips, Tricks, and Security

- You need to genuinely treat giving MCP access like giving a person access to something.
  - Only give read access to what you need, and only grant write on an as-needed basis
  - Hands-on: It'd be really cool to show a security exploit of someone exfiltrating a database query
- Too many MCP tools confuses agents
  - As of writing, 40 is the limit, and probably should be less
  - Show how to limit tools from an MCP server exposed to Cursor/Claude

## Wrap Up

- This all bound to change. AI and MCP changes week to week
- Good job, vibe on.
