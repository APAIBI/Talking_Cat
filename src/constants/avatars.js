export const AVATARS = [
  {
    id: 'rocky',
    name: 'Rocky',
    species: 'Siberian Husky',
    tagline: 'Loyal Husky with Human Male Voice',
    icon: '🐺',
    imageSrc: './avatars/rocky.jpg',
    aspectRatio: '3/4',
    // Exact facial calibration for realistic mouth & eye alignment
    faceCoords: {
      mouthX: 48.5,
      mouthY: 24.5,
      mouthWidth: 8.0,
      leftEyeX: 44.5,
      rightEyeX: 53.0,
      eyeY: 17.5,
      eyeWidth: 4.2,
      eyeHeight: 3.8,
      skinTone: '#E5E7EB',
      eyelidTone: '#374151',
      lipTone: '#1F2937',
      innerMouthTone: '#260D0D',
    },
    // Tailored voice profile: Natural human male voice
    voiceProfile: {
      pitch: 0.82,
      speed: 0.98,
      formantHz: 520,
      resonance: 2.2,
      description: 'Warm, deep adult human male voice',
    },
    colorTheme: {
      primary: '#0284C7',      // sky-600
      secondary: '#7DD3FC',    // sky-300
      accent: '#0369A1',       // sky-700
      bgGradient: 'from-slate-200 via-sky-100 to-indigo-100',
      cardBg: 'bg-sky-600',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
      ringColor: 'ring-sky-400',
      shadowColor: 'shadow-sky-400/50',
    },
  },
  {
    id: 'kelvin',
    name: 'Kelvin',
    species: 'Silver Male Cat',
    tagline: 'Athletic Cat with Male Teenager Voice',
    icon: '🐱',
    imageSrc: './avatars/kelvin.jpg',
    aspectRatio: '3/4',
    faceCoords: {
      mouthX: 48.2,
      mouthY: 21.6,
      mouthWidth: 7.8,
      leftEyeX: 43.2,
      rightEyeX: 52.5,
      eyeY: 16.8,
      eyeWidth: 4.4,
      eyeHeight: 4.0,
      skinTone: '#CBD5E1',
      eyelidTone: '#64748B',
      lipTone: '#334155',
      innerMouthTone: '#260B0B',
    },
    // Tailored voice profile: Human male teenager voice
    voiceProfile: {
      pitch: 1.08,
      speed: 1.02,
      formantHz: 1800,
      resonance: 1.8,
      description: 'Clear, youthful human male teenager voice',
    },
    colorTheme: {
      primary: '#64748B',      // slate-500
      secondary: '#CBD5E1',    // slate-300
      accent: '#475569',       // slate-600
      bgGradient: 'from-slate-200 via-zinc-100 to-amber-50',
      cardBg: 'bg-slate-600',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      ringColor: 'ring-slate-400',
      shadowColor: 'shadow-slate-400/50',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    species: 'Teenager in Cyan Kimono',
    tagline: 'Inspired by "I Want to Eat Your Pancreas"',
    icon: '🌸',
    imageSrc: './avatars/sakura.jpg',
    aspectRatio: '3/4',
    faceCoords: {
      mouthX: 50.2,
      mouthY: 21.8,
      mouthWidth: 6.8,
      leftEyeX: 46.5,
      rightEyeX: 53.8,
      eyeY: 18.0,
      eyeWidth: 3.6,
      eyeHeight: 3.2,
      skinTone: '#FDE68A',
      eyelidTone: '#D97706',
      lipTone: '#E11D48',
      innerMouthTone: '#4C0519',
    },
    // Tailored voice profile: Sweet youthful Asian female voice
    voiceProfile: {
      pitch: 1.28,
      speed: 1.02,
      formantHz: 2800,
      resonance: 1.9,
      description: 'Gentle, sweet youthful female anime voice',
    },
    colorTheme: {
      primary: '#0891B2',      // cyan-600
      secondary: '#67E8F9',    // cyan-300
      accent: '#0E7490',       // cyan-700
      bgGradient: 'from-cyan-100 via-teal-50 to-sky-100',
      cardBg: 'bg-cyan-600',
      badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      ringColor: 'ring-cyan-400',
      shadowColor: 'shadow-cyan-400/50',
    },
  },
  {
    id: 'elena',
    name: 'Elena',
    species: 'Adult Woman (Ana de Armas Style)',
    tagline: 'Elegant Woman with Warm Melodic Voice',
    icon: '✨',
    imageSrc: './avatars/elena.jpg',
    aspectRatio: '3/4',
    faceCoords: {
      mouthX: 50.8,
      mouthY: 19.8,
      mouthWidth: 7.2,
      leftEyeX: 47.5,
      rightEyeX: 54.2,
      eyeY: 16.6,
      eyeWidth: 3.6,
      eyeHeight: 3.2,
      skinTone: '#FED7AA',
      eyelidTone: '#C2410C',
      lipTone: '#BE123C',
      innerMouthTone: '#4C0519',
    },
    // Tailored voice profile: Warm, elegant adult female voice
    voiceProfile: {
      pitch: 1.15,
      speed: 1.0,
      formantHz: 2200,
      resonance: 1.8,
      description: 'Warm, elegant adult woman melodic voice',
    },
    colorTheme: {
      primary: '#059669',      // emerald-600
      secondary: '#6EE7B7',    // emerald-300
      accent: '#047857',       // emerald-700
      bgGradient: 'from-emerald-100 via-teal-50 to-stone-100',
      cardBg: 'bg-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      ringColor: 'ring-emerald-400',
      shadowColor: 'shadow-emerald-400/50',
    },
  },
];
