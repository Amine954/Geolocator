import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface GeolocateRequestBody {
  imageBase64: string;
  mediaType: string;
}

const PROMPT = `Analyse cette image attentivement et identifie sa localisation géographique probable.
Réponds UNIQUEMENT avec un objet JSON valide. Pas de markdown, pas de bloc de code, aucun texte avant ou après. Juste le JSON brut.
Le champ "visual_clues" est OBLIGATOIRE et doit contenir entre 3 et 5 indices — il ne doit jamais être vide.
Structure JSON requise :
{
  "country": "nom du pays en français",
  "city_or_region": "ville ou région la plus probable",
  "confidence": "faible" ou "moyen" ou "élevé",
  "visual_clues": ["indice 1", "indice 2", "indice 3"]
}
Pour visual_clues, décris ce que tu vois vraiment : style architectural, végétation, langue des panneaux, type de véhicules, qualité de la lumière, vêtements, infrastructure routière, éléments culturels, paysage. Donne toujours au moins 3 indices même si la localisation est inconnue.`;

export async function POST(request: NextRequest) {
  try {
    const body: GeolocateRequestBody = await request.json();
    const { imageBase64, mediaType } = body;

    if (!imageBase64 || !mediaType) {
      return NextResponse.json(
        { error: 'Image manquante ou format invalide' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API OpenRouter non configurée (OPENROUTER_API_KEY manquante)' },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
      timeout: 30000,
    });

    const response = await client.chat.completions.create({
      model: 'nvidia/nemotron-nano-12b-v2-vl:free',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mediaType};base64,${imageBase64}` },
            },
            {
              type: 'text',
              text: PROMPT,
            },
          ],
        },
      ],
    });

    if (!response.choices || response.choices.length === 0) {
      console.error('Empty response from model:', JSON.stringify(response));
      return NextResponse.json(
        { error: 'Le modèle n\'a retourné aucune réponse. Réessayez.' },
        { status: 500 }
      );
    }

    const raw = response.choices[0]?.message?.content?.trim() ?? '';
    const jsonStr = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error('JSON parse error. Raw response:', raw);
      return NextResponse.json(
        { error: 'Impossible de parser la réponse. Réessayez.' },
        { status: 500 }
      );
    }

    if (!Array.isArray(parsed.visual_clues) || parsed.visual_clues.length === 0) {
      parsed.visual_clues = ['Aucun indice retourné par le modèle'];
    }

    return NextResponse.json({ result: parsed });
  } catch (error) {
    console.error('Geolocate API error:', error);
    const message = error instanceof Error ? error.message : 'Erreur serveur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
