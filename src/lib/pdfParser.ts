import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for PDF.js to run in the browser using CDN
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export type ParsedPDFData = {
  id: string; // temp id for UI
  title: string;
  description: string;
  price: string;
  imageBase64: string;
  category_slug: string;
};

/**
 * Parses a PDF File object to extract multiple listings (1 page = 1 listing).
 */
export async function parsePdfToListing(file: File): Promise<ParsedPDFData[]> {
  const arrayBuffer = await file.arrayBuffer();
  
  // 1. Load the PDF document
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  if (pdf.numPages === 0) {
    throw new Error('PDF has no pages');
  }

  const results: ParsedPDFData[] = [];

  // Parse each page as a separate listing
  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const fullText = textContent.items.map((item: any) => item.str).join(' ');

      // Render the page to a canvas to extract it as a cover image
      const viewport = page.getViewport({ scale: 2.0 }); // High res
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
      }
      
      // Convert canvas to base64 JPEG
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);

      // Heuristic text extraction for Title, Price, Description
      const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
      
      let title = `${file.name.replace('.pdf', '')} - Page ${i}`;
      if (lines.length > 0) {
        // Usually the first prominent text is the title
        title = lines[0].substring(0, 60); 
      }

      // Look for a price (e.g., € 1500, or 1,500€)
      const priceMatch = fullText.match(/€\s*(\d+[.,]?\d*)/);
      let price = '';
      if (priceMatch && priceMatch[1]) {
        price = priceMatch[1].replace(',', '.');
      }

      // Description is just the first few lines concatenated
      let description = '';
      if (lines.length > 1) {
         description = lines.slice(1, 6).join('. ').substring(0, 300) + '...';
      }

      results.push({
        id: `draft-${Date.now()}-${i}`,
        title,
        description,
        price,
        imageBase64,
        category_slug: 'boat-charters' // Default to boat charters as requested
      });

    } catch (err) {
      console.warn(`Error parsing page ${i}:`, err);
    }
  }

  return results;
}
