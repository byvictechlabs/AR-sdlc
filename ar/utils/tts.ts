let currentUtterance: SpeechSynthesisUtterance | null = null;
let onEndCallback: (() => void) | null = null;

function getIndonesianVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.startsWith("id")) ??
    voices.find((v) => v.lang.startsWith("ms")) ??
    null
  );
}

export function speak(text: string, onEnd?: () => void): void {
  if (!("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }

  stop();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.9;

  const voice = getIndonesianVoice();
  if (voice) utterance.voice = voice;

  onEndCallback = onEnd ?? null;
  utterance.onend = () => {
    currentUtterance = null;
    onEndCallback?.();
    onEndCallback = null;
  };
  utterance.onerror = () => {
    currentUtterance = null;
    onEndCallback?.();
    onEndCallback = null;
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function pause(): void {
  if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

export function resume(): void {
  if ("speechSynthesis" in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

export function stop(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
  onEndCallback = null;
}

export function isSpeaking(): boolean {
  return "speechSynthesis" in window && window.speechSynthesis.speaking;
}

export function isPaused(): boolean {
  return "speechSynthesis" in window && window.speechSynthesis.paused;
}
