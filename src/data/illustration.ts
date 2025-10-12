import type { Artwork } from './types';

// Illustration gallery images
export const illustrationArtwork: Artwork[] = [
  {
    id: 'giant',
    title: 'Giant',
    year: 2024,
    medium: 'Copic on illustration board',
    description: '40 by 60 inches. Winner of Silver award in Illustration West 63.',
    imagePath: 'illustration/Ehrlich_Josh_GIANT_HQ.png',
    category: 'illustration'
  },
  {
    id: 'dragon',
    title: 'Dragon Concept',
    year: 2023,
    medium: 'Digital Painting',
    description: 'Concept art for a personal project.',
    imagePath: 'illustration/Dragon_HQ.png',
    category: 'illustration'
  },
  {
    id: 'exodus',
    title: 'The Exodus',
    year: 2023,
    medium: 'Digital Painting',
    description: 'Narrative illustration depicting a journey.',
    imagePath: 'illustration/The_Exodus_FINAL.png',
    category: 'illustration'
  },
  {
    id: 'perst_canyon',
    title: 'Perst Canyon',
    year: 2022,
    medium: 'Digital Sketch',
    description: 'Environmental concept sketch.',
    imagePath: 'illustration/Perst_Canyon_Sketch_Flip.png',
    category: 'illustration'
  },
  {
    id: 'pointing_gun',
    title: 'Character Study',
    year: 2023,
    medium: 'Digital Painting',
    description: 'Character design exploration.',
    imagePath: 'illustration/pointing gun.png',
    category: 'illustration'
  },
  {
    id: 'p2',
    title: 'Portrait Study',
    year: 2022,
    medium: 'Digital Painting',
    description: 'Character portrait study.',
    imagePath: 'illustration/P2.png',
    category: 'illustration'
  },
  {
    id: 'sketch_1',
    title: 'Sketch Study',
    year: 2022,
    medium: 'Graphite on paper',
    description: 'Quick sketch from sketchbook.',
    imagePath: 'illustration/IMG_9312.PNG',
    category: 'illustration'
  },
  {
    id: 'sketch_2',
    title: 'Character Sketch',
    year: 2022,
    medium: 'Graphite on paper',
    description: 'Character exploration sketch.',
    imagePath: 'illustration/IMG_9512 (1).jpg',
    category: 'illustration'
  },
  {
    id: 'sketch_3',
    title: 'Figure Study',
    year: 2022,
    medium: 'Graphite on paper',
    description: 'Figure drawing study.',
    imagePath: 'illustration/IMG_1115.jpg',
    category: 'illustration'
  },
  {
    id: 'sketch_4',
    title: 'Anatomy Study',
    year: 2022,
    medium: 'Graphite on paper',
    description: 'Anatomical study sketch.',
    imagePath: 'illustration/IMG_1579.PNG',
    category: 'illustration'
  },
  {
    id: 'abstract',
    title: 'Abstract Study',
    year: 2024,
    medium: 'Digital Art',
    description: 'An experimental piece exploring color and form.',
    imagePath: 'illustration/image.png',
    category: 'illustration'
  },
  {
    id: 'mask',
    title: 'Mask Design',
    year: 2023,
    medium: 'Digital Painting',
    description: 'Character mask concept design.',
    imagePath: 'illustration/siftmask.png',
    category: 'illustration'
  },
  {
    id: 'panel',
    title: 'Comic Panel',
    year: 2023,
    medium: 'Digital Art',
    description: 'Comic book panel illustration.',
    imagePath: 'illustration/6pnlfinlwithbrth5.png',
    category: 'illustration'
  }
];

// Illustration gallery row configuration - shows all artwork
export const illustrationRows = [
  {
    id: 'row1',
    height: '300px',
    imageIds: ['giant', 'dragon'],
    imageWidths: ['60%', '40%']
  },
  {
    id: 'row2', 
    height: '250px',
    imageIds: ['exodus', 'perst_canyon', 'pointing_gun'],
    imageWidths: ['50%', '30%', '20%']
  },
  {
    id: 'row3',
    height: '280px',
    imageIds: ['p2', 'sketch_1', 'sketch_2'],
    imageWidths: ['40%', '35%', '25%']
  },
  {
    id: 'row4',
    height: '300px',
    imageIds: ['sketch_3', 'sketch_4'],
    imageWidths: ['55%', '45%']
  },
  {
    id: 'row5',
    height: '260px',
    imageIds: ['abstract', 'mask', 'panel'],
    imageWidths: ['35%', '40%', '25%']
  }
];
