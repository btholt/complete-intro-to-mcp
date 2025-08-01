So let's start with what I would call the wrong way of doing MCP – a one-to-one mapping of an API call to an MCP tool. Our issue tracker about 15ish API calls, we're going to make each one into a tool. We'll get into why this could be a bad call but for now, it's the simplest conceptually to grasp so let's go do that. Or rather, I'm going to make you actually write the code for one and then let you copy/paste the rest. Feel free to do the whole thing, it's just a lot of code of doing the same thing.

First, let's familiarize ourselves with the codebase in the Issues Tracker app. [The code is here on GitHub][issues], specifically the API documentation. Let's skip making the auth headers - it's too easy to prove my point. Getting an agent to successfully sign up and then manage a session just never worked for me, even when I was really trying to. So I made it so you can just nab a valid API key from the frontend. Sign up as a user and click "copy API key" from the header.

> 🚨 In the name of simplicity, I made it so every user can only ever have one valid API key at a time. If you click "copy API key" again, it'll generate a new one and copy it to your clipboard, meaning if you were using that API key elsewhere, it's now invalid. I didn't want to make a whole key management system.

So let's implement a tool to create issues.

```javascript
import { z } from "zod";

export default function apiBasedTools(server) {
  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

  // Helper function to make HTTP requests
  async function makeRequest(method, url, data = null, options = {}) {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // Merge other options except headers (which we already handled)
    const { headers: _, ...otherOptions } = options;
    Object.assign(config, otherOptions);

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const result = await response.text();

      let jsonResult;
      try {
        jsonResult = JSON.parse(result);
      } catch {
        jsonResult = result;
      }

      return {
        status: response.status,
        data: jsonResult,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error) {
      return {
        status: 0,
        error: error.message,
      };
    }
  }
  server.registerTool(
    "issues-create",
    {
      title: "Create Issue",
      description: "Create a new issue",
      inputSchema: {
        title: z.string().describe("Issue title"),
        description: z.string().optional().describe("Issue description"),
        status: z
          .enum(["not_started", "in_progress", "done"])
          .optional()
          .describe("Issue status"),
        priority: z
          .enum(["low", "medium", "high", "urgent"])
          .optional()
          .describe("Issue priority"),
        assigned_user_id: z.string().optional().describe("Assigned user ID"),
        tag_ids: z.array(z.number()).optional().describe("Array of tag IDs"),
        apiKey: z.string().describe("API key for authentication"),
      },
    },
    async (params) => {
      const { apiKey, ...issueData } = params;

      const result = await makeRequest(
        "POST",
        `${API_BASE_URL}/issues`,
        issueData,
        { headers: { "x-api-key": apiKey } }
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
```

Pretty straight forward. The zod types both make it very readable to use and it's what the LLM is going to use to decide what to put where. Let's add one more to list all tags.

We made this into a function that we can then import into our main.js and use. So back there and add this

```javascript
// at top
import apiBasedTools from "./api-based-tools.js";

// under new McpServer
apiBasedTools(server);
```

Make sure you've added this MCP server to your Claude Desktop / Tome, restart it, and then try the prompt

```
Create a new issue in my issue tracker that says "Add Google login to my app", mark it as in progress, and mark it as medium priority. Here is my API key: <YOUR API KEY>
```

Okay, let's take it a step further. Let's say we want to be able to add tags to it. Right now if you say "mark it as a bug" it will try to put "bug" as the tag ID but the tag ID is a number. So the user either needs to know that "bug" is tag ID ## or it just won't work. Let's add a tool for that.

Add this tool.

```javascript
server.registerTool(
  "tags-list",
  {
    title: "List Tags",
    description: "Get all available tags",
    inputSchema: {
      apiKey: z.string().describe("API key for authentication"),
    },
  },
  async ({ apiKey }) => {
    const result = await makeRequest("GET", `${API_BASE_URL}/tags`, null, {
      headers: { "x-api-key": apiKey },
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);
```

Now try

```
Create a new issue in my issue tracker that says "Add Microsoft login to my app", mark it as not started, and mark it as urgent priority. Add the tags frontend and feature. Here is my API key: <YOUR API KEY>
```

Now, if you're using Claude Desktop, this will probably work. If you're using Qwen3:0.6B, well, flip a coin. I've had a hard time to get the smallest Qwen 3 model to do anything more than one step.

Once you feel okay with that, go head and change the import in main.js to import from the complete file

```javascript
import apiBasedTools from "./api-based-tools-complete.js"; // add complete at the end
```

Now you have all API endpoints available. Feel free to try very complex workflows and see how you do.

For me, Claude 4 Sonnet did surprisingly well, only tripping up in a few cases where it shouldn't have after some extensive testing. But the smaller Qwen models were constantly getting it wrong.

[issues]: https://github.com/btholt/mcp-issue-tracker?tab=readme-ov-file#api-documentation
