
/**
 * Extracts title and subtitle from a filename
 * Expected format: "Title - Subtitle.extension"
 */
export function extractTitleAndSubtitle(filename: string): { title: string, subtitle: string } {
  if (!filename) {
    return { title: "Untitled", subtitle: "" };
  }
  
  // Remove file extension
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
  
  // Split by the first dash with optional space
  const parts = nameWithoutExtension.split(/\s*-\s*/, 2);
  
  if (parts.length === 2) {
    return {
      title: parts[0].trim(),
      subtitle: parts[1].trim()
    };
  } else {
    // If no dash is found, use the whole name as title
    return {
      title: nameWithoutExtension.trim(),
      subtitle: ""
    };
  }
}
