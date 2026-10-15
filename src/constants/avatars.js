export const AVATARS = [
  {
    id: 'male-cat',
    name: 'Leo the Cat',
    species: 'Male Ginger Cat',
    tagline: 'Realistic Standing Tabby',
    icon: '🐱',
    imageSrc: './avatars/male-cat.jpg',
    aspectRatio: '3/4',
    // Realistic mouth & eye coordinates (percentage of image)
    faceCoords: {
      mouthX: 50.5,
      mouthY: 26.2,
      mouthWidth: 8.5,
      leftEyeX: 46.0,
      rightEyeX: 55.0,
      eyeY: 21.0,
      eyeWidth: 4.5,
      eyeHeight: 4.0,
    },
    colorTheme: {
      primary: '#F97316',      // orange-500
      secondary: '#FDBA74',    // orange-300
      accent: '#EA580C',       // orange-600
      bgGradient: 'from-amber-100 via-orange-50 to-stone-100',
      cardBg: 'bg-orange-500',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
      ringColor: 'ring-orange-400',
      shadowColor: 'shadow-orange-300/60',
    },
    defaultVoicePreset: 'chipmunk',
    defaultPitch: 1.62,
    defaultSpeed: 1.15,
    defaultEcho: false,
    defaultRobot: false,
  },
  {
    id: 'female-cat',
    name: 'Luna Kitty',
    species: 'Fluffy Calico Kitten',
    tagline: 'Sweet Standing Calico',
    icon: '🎀',
    imageSrc: './avatars/female-cat.jpg',
    aspectRatio: '3/4',
    faceCoords: {
      mouthX: 66.0,
      mouthY: 44.8,
      mouthWidth: 9.0,
      leftEyeX: 58.0,
      rightEyeX: 73.0,
      eyeY: 37.5,
      eyeWidth: 6.0,
      eyeHeight: 5.5,
    },
    colorTheme: {
      primary: '#EC4899',      // pink-500
      secondary: '#F472B6',    // pink-400
      accent: '#BE185D',       // pink-700
      bgGradient: 'from-pink-100 via-purple-50 to-rose-50',
      cardBg: 'bg-pink-500',
      badgeBg: 'bg-pink-100 text-pink-800 border-pink-300',
      ringColor: 'ring-pink-400',
      shadowColor: 'shadow-pink-300/60',
    },
    defaultVoicePreset: 'squeaky',
    defaultPitch: 1.85,
    defaultSpeed: 1.22,
    defaultEcho: false,
    defaultRobot: false,
  },
  {
    id: 'female-human',
    name: 'Maya',
    species: 'Human Companion',
    tagline: 'Realistic 3D Companion',
    icon: '👧',
    imageSrc: './avatars/female-human.jpg',
    aspectRatio: '3/4',
    faceCoords: {
      mouthX: 50.0,
      mouthY: 22.8,
      mouthWidth: 7.5,
      leftEyeX: 46.2,
      rightEyeX: 53.8,
      eyeY: 18.5,
      eyeWidth: 3.8,
      eyeHeight: 3.5,
    },
    colorTheme: {
      primary: '#06B6D4',      // cyan-500
      secondary: '#67E8F9',    // cyan-300
      accent: '#0891B2',       // cyan-600
      bgGradient: 'from-sky-100 via-teal-50 to-indigo-50',
      cardBg: 'bg-cyan-500',
      badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      ringColor: 'ring-cyan-400',
      shadowColor: 'shadow-cyan-300/60',
    },
    defaultVoicePreset: 'friendly',
    defaultPitch: 1.32,
    defaultSpeed: 1.05,
    defaultEcho: false,
    defaultRobot: false,
  },
  {
    id: 'dog',
    name: 'Barnaby Pup',
    species: 'Golden Retriever Pup',
    tagline: 'Realistic Standing Puppy',
    icon: '🐶',
    imageSrc: './avatars/dog.jpg',
    aspectRatio: '1/1',
    faceCoords: {
      mouthX: 63.5,
      mouthY: 37.8,
      mouthWidth: 8.5,
      leftEyeX: 58.0,
      rightEyeX: 68.2,
      eyeY: 25.0,
      eyeWidth: 4.5,
      eyeHeight: 4.0,
    },
    colorTheme: {
      primary: '#8B5CF6',      // violet-500
      secondary: '#A78BFA',    // violet-400
      accent: '#6D28D9',       // violet-700
      bgGradient: 'from-amber-100 via-orange-50 to-yellow-50',
      cardBg: 'bg-amber-600',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      ringColor: 'ring-amber-500',
      shadowColor: 'shadow-amber-400/60',
    },
    defaultVoicePreset: 'deep',
    defaultPitch: 0.82,
    defaultSpeed: 0.95,
    defaultEcho: false,
    defaultRobot: false,
  },
];
