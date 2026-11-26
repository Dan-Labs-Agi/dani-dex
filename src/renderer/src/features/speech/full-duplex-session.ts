import { FullDuplexController } from "./full-duplex-controller";
import { speechPort } from "./speech-port";

const SAMPLE_RATE = 16_000;
const FRAME_SIZE = 2048;

interface Running {
  controller: FullDuplexController;
  stop: () => void;
}

let running: Running | undefined;

export function fullDuplexRunning(): boolean {
  return running !== undefined;
}

export function stopFullDuplex(): void {
  running?.stop();
  running = undefined;
}

/** Opens the microphone and runs the full-duplex loop until stopFullDuplex is called. */
export async function startFullDuplex(onState?: (state: string) => void): Promise<void> {
  if (running) return;
  const voice = window.openbot.voice;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true },
    video: false,
  });
  const input = new AudioContext({ sampleRate: SAMPLE_RATE });
  const output = new AudioContext();
  const source = input.createMediaStreamSource(stream);
  const processor = input.createScriptProcessor(FRAME_SIZE, 1, 1);
  const controller = new FullDuplexController({
    transcribe: async (wav) => (await voice.transcribe({ audio: wav })).text,
    reply: async (text) => (await voice.chatReply({ text })).text,
    speak: (sentence, signal) => playSentence(output, sentence, signal),
    ...(onState ? { onState } : {}),
  });
  processor.onaudioprocess = (event) => {
    void controller.push(new Float32Array(event.inputBuffer.getChannelData(0))).catch(() => {});
  };
  source.connect(processor);
  processor.connect(input.destination);
  running = {
    controller,
    stop: () => {
      processor.disconnect();
      source.disconnect();
      for (const track of stream.getTracks()) track.stop();
      void input.close();
      void output.close();
    },
  };
}

async function playSentence(output: AudioContext, sentence: string, signal: AbortSignal): Promise<void> {
  const audio = await speechPort().voice.speak({ text: sentence, language: null });
  if (signal.aborted) return;
  const samples = new Int16Array(audio.pcm.buffer, audio.pcm.byteOffset, audio.pcm.byteLength / 2);
  const buffer = output.createBuffer(1, samples.length, audio.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) channel[index] = (samples[index] ?? 0) / 0x8000;
  const node = output.createBufferSource();
  node.buffer = buffer;
  node.connect(output.destination);
  await new Promise<void>((resolve) => {
    const finish = () => {
      signal.removeEventListener("abort", finish);
      resolve();
    };
    signal.addEventListener("abort", () => {
      node.stop();
      finish();
    });
    node.addEventListener("ended", finish);
    node.start();
  });
}
