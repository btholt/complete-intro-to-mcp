---
description: >-
  Part of Brian Holt's Complete Intro to MCP course, this section covers Node.js
  setup (recommended v22.18+ and using fnm) with notes on Bun compatibility,
  plus a Tools FAQ detailing the preferred development stack: VS Code with
  specific themes and extensions, Cursor for code generation, Firefox, and a
  streamlined Terminal setup (zsh, Dracula theme, Starship prompt, Nerd Font).
keywords:
  - Brian Holt
  - Complete Intro to MCP
  - Node.js setup
  - fnm
  - VS Code extensions
  - Starship prompt
  - AI tools
---

## Node.js

You'll need to have a Node.js version installed, and preferably something after v22.18.

I use [fnm][fnm] to manage my Node.js versions (similar to nvm).

I _think_ this course would work with recent versions of [bun][bun] but it's untested. Beware if you decide go down this path.

## Tools FAQ

### What tools are your using?

- Visual Studio Code – I used to work at Microsoft on VS Code so it's no surprise that I'll be using it in this course. We'll also be using a few extensions that I'll call out as we get there.
- I also use Cursor fairly frequently as well, particulary when I have large amounts of code to generate.
- Firefox – I want more than Chromium to exist so I support Firefox where I can. Feel free to use any browser; it won't matter in this course.
- Terminal.app – I used to use iTerm2 and Hyper but in the end I appreciate how fast the default terminal is. I'm getting more tempted to try Ghostty.

### What <font/theme/extension> are you using?

- Visual Studio Code
  - Dark+ Theme – It comes installed by default but it's not the default theme anymore. I'm so used to it that I can't switch.
  - [MonoLisa][monolisa] font – I like fonts and I look at it all day so I was okay paying for it. They gave me a code to give you all! `BHOLT10` gives you 10% off (I get no kickback from this, I just like MonoLisa.)
  - I have [ligatures][ligatures] enabled which is why you might see strange glyphs. If you want ligatures but don't want to pay, the linked ligature article has a few. I like Cascadia Code from Microsoft.
  - [vscode-icons][vscode-icons] – Lots of neat icons for VS Code and it's free.
- Terminal
  - zsh – It comes with macOS now and I'm _way_ too lazy to switch back to bash.
  - [Dracula theme][dracula] – I like the pastels. I would use it in VS Code too if Dark+ wasn't ingrained in my blood.
  - [Starship Prompt][starship] – Very cool prompt that's just pretty. Also shows you what sort of project you're in which is occasionally useful
  - [Caskaydia Cove Nerd Font][nerd] – This works with Starship prompt to give you the JS logos and all those extra glyphs. It's based on Cascadia Code.

## AI Assistant

You can use whatever AI assistant for this course, and I suggest you do. If you don't learn something from the course, it's useful to ask an LLM like ChatGPT or Claude to see if they can help you understand. Two pro tips for this class in particular.

- You can find the full text of all these lessons at [https://mcp.holt.courses/llms.txt][llms]. That way you can load everything I've written into the context of the LLM and ask them about the content of the course with the context of everything.
- Likewise, modelcontextprotocol.io has its entire content of its docs at [modelcontextprotocol.io/llms-full.txt][mcp]. Because MCP changes at such a quick pace, it's useful to load some or all of this context into your LLM. Because this one is so big (some 12K lines last I checked) you may not want to load _all_ of this into context, maybe just the sections you need.

[ligatures]: https://worldofzero.com/posts/enable-font-ligatures-vscode/
[monolisa]: https://www.monolisa.dev/
[vscode-icons]: https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons
[dracula]: https://draculatheme.com/terminal
[starship]: https://starship.rs/
[nerd]: https://www.nerdfonts.com/font-downloads
[fnm]: https://github.com/Schniz/fnm
[bun]: https://bun.sh/
[llms]: https://mcp.holt.courses/llms.txt
[mcp]: https://modelcontextprotocol.io/llms-full.txt
