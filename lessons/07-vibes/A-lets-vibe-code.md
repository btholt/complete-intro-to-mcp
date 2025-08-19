---
title: Let's Vibe Code
description: >-
  Brian Holt's Complete Intro to MCP teaches you how to supercharge an AI coding
  agent using the Model Context Protocol (MCP), with hands-on setup for Claude
  Code, Cursor, Windsurf, VS Code Copilot in agent mode, and Zed. The guide also
  covers MCP server workflows via GitHub, Neon for databases, Playwright,
  Context7, Figma, and Vercel, plus practical tips on safety, ORMs like Drizzle,
  and keeping docs up to date.
keywords:
  - mcp
  - model context protocol
  - ai agents
  - coding agent
  - brian holt
  - ai tools
  - github mcp server
---

Let's vibe.

Which still makes me feel like I'm a millennial trying to impress his zoomer nephew every time I say it. What I actually mean is let's supervise an agent writing some code for us, and let's attach some MCP servers to enhance the capabilities of our coding agent.

Let me give you some options to get started here.

- [Claude Code][claude]
- [Cursor][cursor]
- [Windsurf][windsurf]
- [VS Code with Copilot in agent mode][vscode]
- [Zed][zed]

This list isn't exhaustive and is sure to change. The pace of innovation here is as fast as I've ever seen it in my career. But these five work well and I know each of these can support MCP servers.

Most of these aren't free either, unfortunately. You can try to connect VS Code to Ollama - [AI Toolkit][toolkit] is a good way to try. But it'll certainly require a bit more setup and a more powerful PC to get going with.

## GitHub

[Link to the GitHub MCP setup docs][github]. Note you will need a free GitHub account.

Feel free to also use the [Linear MCP server][linear] here, equally as magical. You would also need a free Linear account.

This MCP server is magical. It brings your whole workflow into your coding agent. You can say "file a ticket to do this later and put a full description." You can then later say "fetch that ticket I made before and do it." You can say "take what we've done and turn it into a pull request."

You can essentially use GitHub as your coding agent's task list which more closely reflects how software devs already work. It feels so natural and lets Claude plug into your workflow as if it was just another human in the loop. I might go as far as to say this is the most impactful MCP server to me personally.

## Neon

[Link to the Neon MCP setup docs][neon]. Note you will need a free Neon account.

> Note, I worked on this MCP server at Neon (which is now Databricks) so obviously I have a direct interest in showing you how to do this. Just wanted to disclose my bias here. I believe it's the best MCP server for the best Postgres service, but you can be the judge of that! Feel free to plug in any database MCP server you prefer here.

This might be next in terms of impact in my workflow. This allows my agent to create and manage databases for me, see the schema, manage migrations, etc. The Neon MCP server is really cool because you can get Neon Auth through it as well, meaning you don't need another auth service.

A few point of caution with database

- Don't give an agent access to a database you can't afford to have dropped. Agents are infamous for doing things "this migration isn't working. I'm going to drop everything and recreate it" and in the process dropping all your data.
- Be cautious with what other MCP servers you are using. A malicious MCP server you install along side your database MCP server in theory could convince the agent that it needs all the data from your database at which point it could exfiltrate all that data. So be careful with sensitive data and be careful with untrusted MCP servers. That's just good advice in general.
- Really good idea to give the agent an ORM to work with, with [Drizzle][drizzle] being my favorite. Agents do better with TypeScript than they do with SQL, and are notoriously bad at managing migrations. If you do add an ORM, be sure to be put language in there "DO NOT MODIFY THE MIGRATIONS DIRECTLY, ONLY USE DRIZZLE." Then watch it ignore you and do it anyway 😂

## Playwright

[Link to the Playwright MCP setup docs][playwright]. No account needed.

This one is awesome because you can start getting your agent to test stuff in the browser. "Hey Claude, try signing up, creating three todos, and deleting two and making sure it works at each step." Then Claude will pop up a Chrome browser and take a bunch of screen shots along the way, making sure each step works the way it's supposed to. You can even put in your initial prompt to Claude Code, "make liberal use of Playwright to make sure that UI looks and acts correctly." It'll use a good amount of tokens but it will likely deliver a better product to you.

## Context7

[Link to the Context7 MCP setup docs][context7]. No account needed.

I constantly find that agents will either output old/deprecated code or it will confuse new concepts with old ones. In other words, an LLM has a corpus of knowledge and with code it likely has a slightly outdated set of knowledge on the tech you want it to use. A very good example of this is Neon Auth is fairly new and sometimes if you ask a model to use Neon Auth it will either get confused or try to do something like Passport and just use Neon.

This is where Context7 can be useful - it is up-to-date docs that are generated just in time for the LLM. I find I frequently need to specifically prompt the model "hey, I want you to use the docs from Context7 for this service" because it will generally assume it already knows and doesn't need to reach out for it. In any case, having super-up-to-date info can be very handy, particularly when you find gaps in the LLMs' knowledge.

## Figma

[Link to the Figma MCP setup docs][figma]. Note you would need a paid Figma account.

Unfortunately we're going to skip out on Figma this time - their free tier has zero access to their MCP server and I don't want to recommend you all spend $16+ just try it out. However it is very cool – you just drop in your Figma design system (or use an open source one like Salesforce Lightning, Google Material, or IBM Carbon) and then let your MCP server take care of using the components. It's a very compelling dev loop, particularly if you work at a company that has a good design system already in Figma.

## Vercel

[Link to the Vercel MCP setup docs][vercel]. Note you would need a free Vercel account if it worked.

I really wanted to show you how to deploy after this using MCP but Vercel's MCP server isn't quite ready for Claude Code but it does work with Claude Desktop and VS Code with Copilot. The idea here would be you'd say after you're done `deploy this app to Vercel` and voila you'd have a working app out in production with no fuss. It's coming soon and it might even work by the time you take this course. They just have to fix how auth works with Claude Code.

Another common thing to do is to have Claude Code write an MCP server for something that doesn't have one. Then you can have your own custom made MCP server! One word of caution: be sure to provide the [full MCP docs][mcp] to the agent as it will help a _ton_. I find that LLMs always get it wrong until I provide the docs in context.

## Vibe Coding

So, at this point open Claude Code in a new directly and prompt it was something like this

```
I am making a Todoist clone. I want it to have the following features

- Multiple users
- Users can CRUD their todos
- Users can mark their todos as done
- Users cannot share todos - you can assume that a todo belongs to one person
- Users can use tags to tag their todos. Examples would be work, personal, or fun. Users can CRUD tags. A todo can have multiple tags.
- Users can sign, sign out, and log out.

For the tech stack, please use

- Next.js and React
- shadcn - please use shadcn as the styling method as much as possible to be consistent
- Neon Postgres for the database
- Neon Auth for the auth - please use Context7 to make sure you have up to date docs on Neon Auth
- Drizzle for the ORM
- TypeScript
- ESLint
- Prettier
- Vitest for testing
- Playwright
- Editorconfig

Please:

- include decent coverage of tests and sane linting and code formatting.
- use Playwright MCP server to test that UI is styled correctly and interactions work as planned
- use Context7 liberally to make sure you have the latest docs for various libraries.
- prepare this to be hosted on GitHub. Maintain a useful README for documentation, and mark the project as being Apache 2.0.
- prepare this to be deployed to Vercel afterwards.
- use Neon branching liberally if you need to migrate or test migrations
- DO NOT WRITE OR MODIFY MIGRATIONS YOURSELF. ONLY USE DRIZZLE FOR MIGRATIONS.
```

This isn't necessarily the best prompt but it's a pretty good one to get started with. This is a huge chunk of work for Claude to start working on but I've found Claude Code to be up to the task. When I'm working with Cursor, Windsurf, or VS Code w/ Copilot, I generally have a different LLM (usually Claude) generate a task list first and then I have the LLMs follow the task list and mark off the their tasks one-by-one. In any case, this will get you started pretty well. I was able to "one-shot" (meaning it worked first time) the Todoist app with this.

I'll then usually prompt it to try a few flows with Playwright.

Then I'll add a prompt to push this to GitHub. If I have any future features I want to add, I'll prompt Claude Code to add new tasks for that e.g. "add a GitHub issue to add dark mode. Please include a brief checklist on what needs to be done to make dark mode work".

At this point, you could install the Vercel CLI, log in, and say "please deploy this to Vercel" and usually it'll do pretty well at that too.

That's really it! That's vibe coding!

[toolkit]: https://marketplace.visualstudio.com/items?itemName=ms-windows-ai-studio.windows-ai-studio
[zed]: https://zed.dev/
[vscode]: https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode
[windsurf]: https://windsurf.com/
[claude]: https://www.anthropic.com/claude-code
[cursor]: https://cursor.com
[figma]: https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server/
[mcp]: https://modelcontextprotocol.io/llms-full.txt
[github]: https://github.com/github/github-mcp-server
[neon]: https://neon.com/docs/ai/neon-mcp-server
[playwright]: https://github.com/microsoft/playwright-mcp
[context7]: https://github.com/upstash/context7
[vercel]: https://vercel.com/docs/mcp/vercel-mcp
[linear]: https://linear.app/docs/mcp
