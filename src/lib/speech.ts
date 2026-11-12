// Speech abstraction layer. Defaults to browser Web Speech API.
// Swap providers via env vars (NEXT_PUBLIC_STT_PROVIDER / NEXT_PUBLIC_TTS_PROVIDER).

export type STTProvider = "browser" | "deepgram" | "whisper";
export type TTSProvider = "browser" | "elevenlabs" | "azure";

export function getSTTProvider(): STTProvider {
  return (process.env.NEXT_PUBLIC_STT_PROVIDER as STTProvider) || "browser";
}

export function getTTSProvider(): TTSProvider {
  return (process.env.NEXT_PUBLIC_TTS_PROVIDER as TTSProvider) || "browser";
}

export function speak(text: string, lang = "de-DE") {
  if (typeof window === "undefined") return;
  if (getTTSProvider() !== "browser") {
    // Placeholder: call external TTS endpoint here
    return;
  }
  const synth = window.speechSynthesis;
  if (!synth) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.95;
  synth.cancel();
  synth.speak(utter);
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  window.speechSynthesis?.cancel();
}

export function createRecognizer(
  onResult: (transcript: string, isFinal: boolean) => void,
  onEnd: () => void
) {
  if (typeof window === "undefined") return null;
  const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.lang = "de-DE";
  rec.interimResults = true;
  rec.continuous = false;
  rec.onresult = (e: any) => {
    let transcript = "";
    let isFinal = false;
    for (let i = e.resultIndex; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
      if (e.results[i].isFinal) isFinal = true;
    }
    onResult(transcript, isFinal);
  };
  rec.onend = onEnd;
  rec.onerror = () => onEnd();
  return rec;
}