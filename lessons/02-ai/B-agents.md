I want to dwell a second on the term "agent" / "agentic" as it's a term you probably hear a lot and may wonder what the precise definition is. We'll be using them here so it bears a second to define the term.

I specifically was confused with what an agent was in relation to just LLMs in general when I was first introduced to the terms. When is it an agent versus just being an LLM?

Well, let's say a few things. For one, agent is a buzzword and getting an exact definition for it is tough because it doesn't have a standardized definition and marketing has gone absolutely hog-wild for it. So it becomes difficult to define because you need to disambiguate it from the hype.

I would say an agent is an LLM or a framework of LLMs designed around accomplishing a job that will likely use multiple iterations to accomplish them. It's a very broad definition and not 100% accurate (you could call Claude Desktop an agent with this defintion and that's probably not true.) But the gist is this: you say "hey agent, please do X for me" and it will reason about it, set up some planned steps, and then try to go do that thing for you as it iterates. In a coding agent like [Replit][replit], [v0][v0], [Create.xyz][create], [Same.new][same], [Databutton][databutton], [app.build][app.build] or one of the numerous others, you will ask it to build an app for you, it will make a plan of what it needs to do to build that, and then start generating code to try to make it work. It will then modularly test functionality it is generating and iterate until it's done. This cycle of plan, generate, evaluate, repeat using a framework of LLMs is what I'd deem to make it "agentic".

An LLM, a large language model, are much more focused on text generation given an input, and can make up part of an agentic flow. You can have LLMs without agents - it's hard to have an agent without LLMs.

We'll be using coding IDE agents today, but if you haven't tried one of those online coding agents I mentioned above - do!! They're a blast to work with and you'll learn a ton.

[replit]: https://repl.it
[v0]: https://v0.dev
[create]: https://create.xyz
[same]: https://same.new
[databutton]: https://databutton.com
[app.build]: https://app.build
