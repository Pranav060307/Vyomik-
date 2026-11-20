export interface SizeMeasurement {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  chestCm: number;
  lengthCm: number;
  shoulderCm: number;
  sleeveCm: number;
  chestIn: number;
  lengthIn: number;
  shoulderIn: number;
  sleeveIn: number;
}

export const HOODIE_SIZE_CHART: SizeMeasurement[] = [
  {
    size: 'XS',
    chestCm: 96,
    lengthCm: 64,
    shoulderCm: 44,
    sleeveCm: 58,
    chestIn: 37.8,
    lengthIn: 25.2,
    shoulderIn: 17.3,
    sleeveIn: 22.8,
  },
  {
    size: 'S',
    chestCm: 102,
    lengthCm: 66,
    shoulderCm: 46,
    sleeveCm: 59,
    chestIn: 40.2,
    lengthIn: 26.0,
    shoulderIn: 18.1,
    sleeveIn: 23.2,
  },
  {
    size: 'M',
    chestCm: 108,
    lengthCm: 68,
    shoulderCm: 48,
    sleeveCm: 60,
    chestIn: 42.5,
    lengthIn: 26.8,
    shoulderIn: 18.9,
    sleeveIn: 23.6,
  },
  {
    size: 'L',
    chestCm: 114,
    lengthCm: 70,
    shoulderCm: 50,
    sleeveCm: 61,
    chestIn: 44.9,
    lengthIn: 27.6,
    shoulderIn: 19.7,
    sleeveIn: 24.0,
  },
  {
    size: 'XL',
    chestCm: 120,
    lengthCm: 72,
    shoulderCm: 52,
    sleeveCm: 62,
    chestIn: 47.2,
    lengthIn: 28.3,
    shoulderIn: 20.5,
    sleeveIn: 24.4,
  },
  {
    size: 'XXL',
    chestCm: 126,
    lengthCm: 74,
    shoulderCm: 54,
    sleeveCm: 63,
    chestIn: 49.6,
    lengthIn: 29.1,
    shoulderIn: 21.3,
    sleeveIn: 24.8,
  },
];

export const MEASUREMENT_INSTRUCTIONS = [
  {
    label: 'Chest',
    instruction: 'Measure around the fullest part of your chest.',
  },
  {
    label: 'Length',
    instruction: 'From highest point of shoulder to hem.',
  },
  {
    label: 'Shoulder',
    instruction: 'Across the back from one shoulder to another.',
  },
  {
    label: 'Sleeve',
    instruction: 'From shoulder seam to wrist.',
  },
];

