We're not going to dwell here too much because this was a pretty short lived idea, being introduced in November '24 and being deprecated in March '25 in favor of streamable HTTP, but it's out there and I want it to not be unfamiliar to you.

So the problem we have with the stdio transport (transport is what we call the way info is exchanged - think HTTP vs WebSockets, different ways of communicating) we've been using so far is that it only works locally. You have to download an MCP server from somewhere and run it yourself. This offers a lot of advantages - it will have access to local files, USB, terminals, etc. and you can choose how to scale it. It also could be a bit of a security liability - you're letting arbitrary code run locally and the "person" in charge is an agent. This is one of the biggest critcisms in general about MCP servers. You also have to be sure to update it yourself - if the MCP maker pushes an update, you need to go grab it yourself.

So enter the need for a "remote" MCP server - something an LLM can use like a a local stdio MCP server, but acts more like an API server where it can make those MCP calls to a remote location.

The first attempt of this was a "server-side event" (nearly always written as SSE) protocol where you'd call an SSE endpoint and be given back a second endpoint that has a unique identifier for this session. The client (like Claude Desktop) will keep an open connection to this main endpoint and receive messages from the server as HTTP messages sent. If the client needs to send something to the server, the client POSTs a message to the unique endpoint that it got initially.

![SSE diagram](/images/sse.png)
<small>Source: [modelcontextprotocol.io](https://modelcontextprotocol.io/specification/2024-11-05/basic/transports#http-with-sse)</small>

Does it sound messy and complicated? Yeah, it is.

It does work, and for an average use case on a stable network, it's pretty okay. But the biggest problem is that if for whatever reason your session ends (bad network conditions, server crash on either side, etc.) and the session is dropped, there's no way to resume it - you just need to start again. This could be no big deal or it really could wreck your usecase.

So this didn't stick around very long before they replaced it with streamable HTTP, and we're just going to jump straight to that as it's better in every single way - I can't think of a reason you'd implement SSEs today other than you're concerned about supporting some client that can't / won't do streamable HTTP.

If you want to read more docs about it, [head here][sse].

[sse]: https://modelcontextprotocol.io/specification/2024-11-05/basic/transports#http-with-sse
