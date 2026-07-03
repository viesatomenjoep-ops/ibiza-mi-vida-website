import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
// @ts-ignore
import pdf from 'pdf-parse'

export const maxDuration = 60 // Allow API to run longer for Gemini processing

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API-sleutel ontbreekt. Voeg GEMINI_API_KEY toe aan .env.local' },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Geen PDF bestand geüpload' }, { status: 400 })
    }

    // Convert file to buffer and parse PDF
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    let pdfText = ''
    try {
      const parsedPdf = await pdf(buffer)
      pdfText = parsedPdf.text
    } catch (parseError: any) {
      console.error('Error parsing PDF text:', parseError)
      return NextResponse.json(
        { error: 'Kon de tekst uit de PDF niet extraheren: ' + parseError.message },
        { status: 500 }
      )
    }

    if (!pdfText.trim()) {
      return NextResponse.json(
        { error: 'Het PDF bestand bevat geen leesbare tekst' },
        { status: 400 }
      )
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })

    const prompt = `
Extract exact boat specifications from this brochure text.
Convert values and output a strict JSON object with this format:
{
  "name": "Exact boat model name (e.g. Fjord 40 Open)",
  "type": "Yacht type (e.g. Luxury Yacht, Sporty RIB, Catamaran)",
  "capacity": "Passenger capacity (e.g. '12 pers.' or '10 + 1 crew')",
  "length": "Length (e.g. '12m' or '7.5m')",
  "engine": "Engine details (e.g. '2x 370 HP' or '250 HP')",
  "price_from": 1250, // Base daily price as a number, defaults to 650 if not found
  "features": ["Feature 1", "Feature 2", "Feature 3"] // Max 4 highlight features translated to Dutch (e.g. 'Inclusief schipper', 'Drankjes & ijsbox', 'Snorkelsets', 'Grote ligbedden')
}

Brochure Text:
${pdfText}
`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    if (!responseText) {
      throw new Error('Gemini AI returned an empty response')
    }

    const boatData = JSON.parse(responseText.trim())

    return NextResponse.json({
      success: true,
      data: boatData
    })

  } catch (error: any) {
    console.error('API Error in parse-pdf:', error)
    return NextResponse.json(
      { error: 'PDF parsing mislukt: ' + error.message },
      { status: 500 }
    )
  }
}
