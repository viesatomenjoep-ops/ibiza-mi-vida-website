import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for PDF.js to run in the browser using CDN
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export type ParsedPDFData = {
  title: string;
  description: string;
  price: string;
  imageBase64: string;
};

/**
 * Parses a PDF File object to extract text and a cover image (base64).
 */
export async function parsePdfToListing(file: File): Promise<ParsedPDFData> {
  const arrayBuffer = await file.arrayBuffer();
  
  // 1. Load the PDF document
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  if (pdf.numPages === 0) {
    throw new Error('PDF has no pages');
  }

  // 2. Extract text from the first few pages (up to 3 to keep it fast)
  let fullText = '';
  const pagesToParse = Math.min(pdf.numPages, 3);
  
  for (let i = 1; i <= pagesToParse; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + ' \n';
  }

  // 3. Render the first page to a canvas to extract it as a cover image
  const firstPage = await pdf.getPage(1);
  const viewport = firstPage.getViewport({ scale: 2.0 }); // High res
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  if (context) {
    await firstPage.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
  }
  
  // Convert canvas to base64 JPEG
  const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);

  // 4. Heuristic text extraction for Title, Price, Description
  // Basic heuristic: first non-empty line might be the title
  const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
  
  let title = file.name.replace('.pdf', '');
  if (lines.length > 0) {
    // Usually the first prominent text is the title
    title = lines[0].substring(0, 50); 
  }

  // Look for a price (e.g., € 1500, or 1,500€)
  const priceMatch = fullText.match(/€\s*(\d+[.,]?\d*)/);
  let price = '';
  if (priceMatch && priceMatch[1]) {
    price = priceMatch[1].replace(',', '.');
  }

  // Description is just the first few lines concatenated
  const description = lines.slice(1, 4).join('. ').substring(0, 200) + '...';

  return {
    title,
    description,
    price,
    imageBase64
  };
}
