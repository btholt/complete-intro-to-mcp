import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { titleCase } from "title-case";
import { getLessons } from "../data/lesson.js";

async function generateFullText() {
  // Read course.json to get the output path
  const configBuffer = await fs.readFile(
    path.join(process.cwd(), "./course.json")
  );
  const config = JSON.parse(configBuffer);

  // Check if llmFullTextPath exists, if not skip writing the file
  if (!config.llmFullTextPath) {
    console.log(
      "⏺️ llmFullTextPath not found in course.json, skipping file generation"
    );
    return;
  }

  const outputPath = path.resolve(config.llmFullTextPath);

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  await fs.mkdir(outputDir, { recursive: true });

  // Get all lessons using the existing logic
  const sections = await getLessons();

  let fullText = "";

  for (const section of sections) {
    for (const lesson of section.lessons) {
      try {
        // Read the lesson file
        const file = await fs.readFile(lesson.path);
        const { data, content } = matter(file.toString());

        // Get the title - use frontmatter title if available, otherwise use title case
        const title = data.title || titleCase(lesson.slug.split("-").join(" "));

        // Use the raw markdown content instead of converting to plain text
        const markdownContent = content.trim();

        // Add the lesson to the full text with separator and title
        if (fullText) {
          fullText += "\n\n=================\n\n";
        }

        fullText += `# ${title}\n\n${markdownContent}`;

        console.log(`✅ Added lesson: ${title}`);
      } catch (error) {
        console.error(
          `❌ Error processing lesson ${lesson.path}:`,
          error.message
        );
      }
    }
  }

  // Write the combined text to the output file
  await fs.writeFile(outputPath, fullText);
  console.log(`🎉 Full text written to: ${outputPath}`);
  console.log(`📊 Total length: ${fullText.length} characters`);
}

// Run the script
generateFullText().catch(console.error);
