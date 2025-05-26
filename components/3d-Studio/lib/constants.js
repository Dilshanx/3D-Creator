export const saneNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
};

export const CATEGORIES_DATA = [
  { id: "animals", name: "Animals", icon: "🐱" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "people", name: "People", icon: "👤" },
  { id: "objects", name: "Objects", icon: "📱" },
];

export const SHAPES_BY_CATEGORY_DATA = {
  animals: [
    { id: "cat", name: "Cat", icon: "🐱" },
    { id: "bird", name: "Bird", icon: "🐦" },
    { id: "fish", name: "Fish", icon: "🐟" },
  ],
  sports: [
    { id: "soccer", name: "Soccer", icon: "⚽" },
    { id: "tennis", name: "Tennis", icon: "🎾" },
    { id: "basketball", name: "Basketball", icon: "🏀" },
  ],
  people: [
    { id: "person", name: "Person", icon: "👤" },
    { id: "robot", name: "Robot", icon: "🤖" },
  ],
  objects: [
    { id: "phone", name: "Phone", icon: "📱" },
    { id: "lightning", name: "Lightning", icon: "⚡" },
    { id: "music", name: "Music Note", icon: "🎵" },
  ],
};

export const BACKGROUND_OPTIONS_DATA = {
  modernGradient: "Modern Gradient",
  darkSpace: "Dark Space",
  softLight: "Soft Light",
  studioDark: "Studio Dark",
  studioLight: "Studio Light",
};

export const ANIMATION_PRESETS_DATA = {
  gentle: {
    rotationSpeed: [0.002, 0.004, 0.001],
    floatAmplitude: 0.03,
    floatSpeed: 0.0003,
  },
  energetic: {
    rotationSpeed: [0.008, 0.012, 0.004],
    floatAmplitude: 0.08,
    floatSpeed: 0.001,
  },
  dramatic: {
    rotationSpeed: [0.01, 0.005, 0.015],
    floatAmplitude: 0.12,
    floatSpeed: 0.0008,
  },
  bounce: {
    rotationSpeed: [0.003, 0.006, 0.002],
    floatAmplitude: 0.15,
    floatSpeed: 0.002,
  },
  spin: {
    rotationSpeed: [0.02, 0.02, 0.02],
    floatAmplitude: 0.02,
    floatSpeed: 0.0005,
  },
};
