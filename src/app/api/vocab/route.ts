import { NextResponse } from "next/server";
import { getAllVocab } from "@/data/vocab";

export async function GET() {
  const vocab = getAllVocab();
  return NextResponse.json(vocab.map((v) => ({ word: v.word, definition: v.definition, level: v.level })));
}
