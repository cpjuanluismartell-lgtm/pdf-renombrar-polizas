
/**
 * Extracts all text from the first page of a PDF file.
 * @param file The PDF file object.
 * @returns A promise that resolves to a single string containing all text from the first page.
 */
async function extractTextFromFirstPage(file: File): Promise<string> {
    // @ts-ignore
    if (!window.pdfjsLib) {
        throw new Error('PDF.js library not loaded.');
    }
    const arrayBuffer = await file.arrayBuffer();
    // @ts-ignore
    const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(' ');
}

/**
 * Finds the policy concept in a string of text using a regular expression.
 * It looks for the phrase "Póliza de" and captures the text that follows,
 * stopping before the word "correspondiente" if it exists.
 * @param text The text extracted from the PDF.
 * @returns The matched concept string or null if not found.
 */
function findConceptWithRegex(text: string): string | null {
    // Looks for "Póliza de", captures the text non-greedily until it finds
    // " correspondiente" or the end of the string.
    const regex = /Póliza de\s+(.*?)(?:\s+correspondiente|$)/i;
    const match = text.match(regex);
    
    // The concept is in the first capturing group.
    if (match && match[1]) {
        // Clean up the matched string by removing extra whitespace
        return match[1].trim().replace(/\s+/g, ' ');
    }
    
    return null;
}

/**
 * Processes a PDF file locally to extract and rename it based on its content.
 * @param file The PDF file to process.
 * @returns A promise that resolves to the new name or 'NO_NAME_FOUND'.
 */
export async function renamePdfLocally(file: File): Promise<string> {
    const text = await extractTextFromFirstPage(file);
    const concept = findConceptWithRegex(text);
    return concept || 'NO_NAME_FOUND';
}
