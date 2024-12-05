import axios from 'axios';

export class AudioManager {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = new Map();
    this.lastPlayTime = 0;
    this.cooldownPeriod = 2000; // 2 seconds between voice lines
    
    this.ELEVENLABS_API_KEY = 'sk_4716d14a66fc72a62826ac115a17597df6d454442a3c6fcd';
    this.VOICE_ID = 'qnu508RyjLlL2dh1kfgu';

    this.phrases = {
      tricks: [
        "Sick trick, dude!",
        "That was insane!",
        "Keep shredding!",
        "You're killing it!"
      ],
      greetings: [
        "Hey, show me what you got!",
        "Welcome to the park!",
        "Ready to shred?",
        "Let's see some tricks!"
      ],
      challenges: [
        "Try to grind that rail!",
        "Bet you can't do a 360!",
        "Race you to the other side!",
        "Do a kickflip over that gap!"
      ]
    };
  }

  async initialize() {
    try {
      // Pre-generate some audio for better performance
      for (const category in this.phrases) {
        for (const phrase of this.phrases[category]) {
          await this.generateAndStoreAudio(phrase);
        }
      }
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  async generateAndStoreAudio(text) {
    try {
      const response = await axios({
        method: 'POST',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${this.VOICE_ID}`,
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': this.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        data: {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        },
        responseType: 'arraybuffer'
      });

      const audioBuffer = await this.audioContext.decodeAudioData(response.data);
      this.sounds.set(text, audioBuffer);
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  }

  playRandomPhrase(category, volume = 1.0) {
    const now = Date.now();
    if (now - this.lastPlayTime < this.cooldownPeriod) return;

    const phrases = this.phrases[category];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const buffer = this.sounds.get(randomPhrase);

    if (buffer) {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.value = volume;
      source.start(0);
      this.lastPlayTime = now;
    }
  }
}
