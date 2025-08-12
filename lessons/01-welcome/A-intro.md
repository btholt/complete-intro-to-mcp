---
description: >-
  Learn how MCP (Model Context Protocol) augments AI tools to perform tasks by
  building MCP servers and integrating with APIs, as Brian Holt guides beginners
  in Complete Intro to MCP for Frontend Masters. This JavaScript/Node.js course
  covers creating reliable AI agents and toolchains with model-context
  workflows, with hands-on projects and a GitHub repo for practice.
keywords:
  - MCP
  - Model Context Protocol
  - AI agents
  - AI tools
  - Brian Holt
  - Frontend Masters
  - JavaScript
---

Hello! And welcome to the Complete Intro to MCP as taught for Frontend Masters! This is for anyone looking to level up their skills with AI. No AI experience is necessary! I will show you all the tools you need to use and this will be super helpful to AI aficionados and newbies alike.

MCP is a protocol for augmenting the abilities of various AI tools to _do_ things. You'd write an MCP server to interact with an API or to create a calendar invite or something like that. It mixes the determinism of code with the flexibility of AI/agents/LLMs. You could try to get the AI to generate code and run it on the fly (and sometimes this is a good idea) but these are useful capabilities you want your AI to be able to repeatedly do reliably. It gives your agent tools to act.

## Who is this course for?

You! This course is for anyone looking to get more experience in AI or MCP or "vibe coding". You'll find it all here.

This course is written in JavaScript and Node.js, so experience there is helpful, but honestly if you're really handy with LLMs and can reliably generate code that works, you'll be able to survive here just fine. The more coding experience you have the better, but you can also start here! This course is for anyone looking to level up their skills.

## Who am I?

![Brian teaching](/images/social-share-cover.jpg)

My name is Brian Holt and I've been shipping AI tools for the last three or so years, across Snowflake, Neon, and Databricks.

I currently work as a product manager at [Databricks][databricks] working on AI infrastructure. I came into Databricks via the [Neon][neon] acquisition. I loved working on AI, dev tools, and dev experiences so much that I ended up working in AI strategy and product! Previous to Neon, I've worked at Snowflake, Microsoft, LinkedIn, Netflix, Reddit, and some other startups. I've done everything from VP of product to dev rel to staff engineering tech lead.

When I'm not working or teaching, you'll find me hanging out with my wife, son, and my newborn daughter! I've lived the past six years in Seattle but I've just moved to Sacramento to get a bit more sun and to live close to amazing snowboarding in Tahoe! 🏂 I also enjoy hazy IPAs, Islay Scotches, road cycling, and playing Elden Ring Nightreign poorly.

Please catch up with me on social media! Be aware that I'm awful at responding to DMs!!

- [𝕏][x]
- [Bluesky][bs]
- [LinkedIn][li]
- [GitHub][gh]

## Where to File Issues

I write these courses and take care to not make mistakes. However when teaching over ten hours of material, mistakes are inevitable, both here in the grammar and in the course with the material. However I (and the wonderful team at Frontend Masters) are constantly correcting the mistakes so that those of you that come later get the best product possible. If you find a mistake we'd love to fix it. The best way to do this is to [open a pull request or file an issue on the GitHub repo][issues]. While I'm always happy to chat and give advice on social media, I can't be tech support for everyone. And if you file it on GitHub, those who come later can Google the same answer you got.

## How the repo works

There are two repos for this class: [the website you're currently on][site] and [the example projects][projects]. To get set up, clone or [download][zip] the projects repo:

```bash
git clone https://github.com/btholt/mcp-issue-tracker.git
```

I've written a whole project for you to work with, a GitHub-style issue tracker, so we'll be working with that for our project partway through the course.

> And one last request! [Please star this repo][site]. It helps the course be more discoverable and with my fragile ego.

[x]: https://twitter.com/holtbt
[bs]: https://bsky.app/profile/brianholt.me
[li]: https://www.linkedin.com/in/btholt/
[gh]: https://github.com/btholt
[site]: https://github.com/btholt/complete-intro-to-mcp
[projects]: https://github.com/btholt/mcp-issue-tracker
[issues]: https://github.com/btholt/mcp-issue-tracker/issues
[neon]: https://neon.tech/
[databricks]: https://www.databricks.com/product/lakebase
[zip]: https://github.com/btholt/mcp-issue-tracker/archive/refs/heads/main.zip
