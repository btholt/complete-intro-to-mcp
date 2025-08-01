Here's a real interaction using the complete MCP server I just had with Qwen3:.6B.

```
> 👤 using the issues-tracker-server mcp server, create a new issue in my issue tracker that tracks that I need to fix the login bug and mark it urgent and assign it to me. use the api key <API_KEY>

> 🤖 The tool call was made with the assigned_user_id set to "me", but the system is rejecting this, indicating a mismatch. The error suggests that the assigned user ID "me" does not exist in the system. Could you confirm that your assigned user ID is correctly set to "your-own-id" instead? Let me know, and I'll assist accordingly
```

This is where just mapping your API server to an MCP server runs into trouble.

- Sequential calls are hard to get right. In this case it'd need to use the API key to try to figure out who you are, then call create issue with that ID.
- Giving a agent lots of tools may mean that it can be more flexible but it also leads to confusion. Just by including the health check it'll call it at the most random times! Agents will make weird, questionable, or even downright-wrong decisions with which tool to use. A smaller set of focused tools is much more likely to succeed.
- Generally speaking, you know the few actions you want your model to take. It's better to just codify these and slowly add more actions later.

I'm going to call this "jobs oriented" MCP server as opposed to "API oriented". I made up these terms. But it suits what we're trying to get done today.

Instead of having our infinitely flexible API server and hoping the LLM chooses right, let's say we know we really only want our MCP server to do three thinks

- Create new bugs and mark them as high priority
- Create new feature request and mark them as low priority
- Update the status of a ticket

Frankly, after writing these, they aren't that different. But man, the difference in success particularly with Qwen3:.6 is **night** and **day**.

```javascript
import { z } from "zod";

export default function jobsBasedTools(server) {
  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

  // Hardcoded tag IDs from database
  const BUG_TAG_ID = 3;
  const FEATURE_TAG_ID = 4; // Helper function to make HTTP requests
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

  // Tool 1: Create new bug with high priority
  server.registerTool(
    "create-bug",
    {
      title: "Create High Priority Bug",
      description: "Create a new bug issue with high priority and bug tag",
      inputSchema: {
        title: z.string().describe("Bug title"),
        description: z.string().describe("Bug description"),
        apiKey: z.string().describe("API key for authentication"),
      },
    },
    async (params) => {
      const { apiKey, ...bugData } = params;

      // Create bug with high priority and bug tag
      const issueData = {
        ...bugData,
        priority: "high",
        status: "not_started",
        tag_ids: [BUG_TAG_ID], // Hardcoded bug tag ID
      };

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

  // Tool 2: Create new feature request with low priority
  server.registerTool(
    "create-feature-request",
    {
      title: "Create Low Priority Feature Request",
      description:
        "Create a new feature request issue with low priority and feature tag",
      inputSchema: {
        title: z.string().describe("Feature request title"),
        description: z.string().describe("Feature request description"),
        apiKey: z.string().describe("API key for authentication"),
      },
    },
    async (params) => {
      const { apiKey, ...featureData } = params;

      // Create feature request with low priority and feature tag
      const issueData = {
        ...featureData,
        priority: "low",
        status: "not_started",
        tag_ids: [FEATURE_TAG_ID], // Hardcoded feature tag ID
      };

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

  // Tool 3: Update ticket status
  server.registerTool(
    "update-ticket-status",
    {
      title: "Update Ticket Status",
      description: "Update the status of an existing ticket/issue",
      inputSchema: {
        id: z.number().describe("Issue ID to update"),
        status: z
          .enum(["not_started", "in_progress", "done"])
          .describe("New status for the ticket"),
        apiKey: z.string().describe("API key for authentication"),
      },
    },
    async (params) => {
      const { id, status, apiKey } = params;

      const result = await makeRequest(
        "PUT",
        `${API_BASE_URL}/issues/${id}`,
        { status },
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

Feel free to type this out, but in reality the _code_ isn't very different, just the _semantics_ are. So I'd say go ahead and copy paste.

Essentially we've just narrowed down what we want our MCP server to do, added some strong opinions to it, and called it good. Instead of being able to have any tag be added on the fly, we're just allowing bugs and feature requests to be filed. Instead of worrying about users, we're letting it just be unassigned. This is less flexible, but after playing with it with a very small model for a while, I've had 0 errors, as opposed to the probably 60% error rate I had with the API based tools.

> A note here: _sampling_ like we talked about here would be super helpful. I'd implment the tags and the users as sampling. I'd request all the available tags and users then I'd have the LLM choose the correct tags/users to apply. Elicitation could be good too - let the user choose - but if it's going to be an obvious answer then the LLM might as well do it.

And that's our project!!
