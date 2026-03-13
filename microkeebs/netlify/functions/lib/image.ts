import sharp from 'sharp';

const MAX_WIDTH = 1920;
const THUMBNAIL_WIDTH = 400;
const QUALITY = 85;
const BUILD_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export interface ProcessedImage {
  full: Buffer;
  thumbnail: Buffer;
}

export async function processImage(input: Buffer): Promise<ProcessedImage> {
  // Get image metadata
  const metadata = await sharp(input).metadata();
  
  // Process full-size image
  let fullPipeline = sharp(input)
    .webp({ quality: QUALITY });

  // Resize if larger than max width
  if (metadata.width && metadata.width > MAX_WIDTH) {
    fullPipeline = fullPipeline.resize(MAX_WIDTH, null, {
      withoutEnlargement: true,
    });
  }

  const full = await fullPipeline.toBuffer();

  // Create thumbnail
  const thumbnail = await sharp(input)
    .resize(THUMBNAIL_WIDTH, null, {
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY })
    .toBuffer();

  return { full, thumbnail };
}

export async function validateImage(input: Buffer): Promise<{ valid: boolean; error?: string }> {
  try {
    const metadata = await sharp(input).metadata();
    
    // Check format
    const allowedFormats = ['jpeg', 'png', 'webp', 'gif', 'avif'];
    if (!metadata.format || !allowedFormats.includes(metadata.format)) {
      return { valid: false, error: `Invalid format: ${metadata.format}` };
    }

    // Check size (10MB max)
    if (input.length > 10 * 1024 * 1024) {
      return { valid: false, error: 'File too large (max 10MB)' };
    }

    // Check dimensions
    if (!metadata.width || !metadata.height) {
      return { valid: false, error: 'Could not read image dimensions' };
    }

    if (metadata.width < 100 || metadata.height < 100) {
      return { valid: false, error: 'Image too small (min 100x100)' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid image file' };
  }
}

export function isValidBuildId(buildId: string): boolean {
  return BUILD_ID_PATTERN.test(buildId);
}

export function getClientImagePath(buildId: string, index: number): string {
  if (!isValidBuildId(buildId)) {
    throw new Error('Invalid build ID');
  }

  if (!Number.isInteger(index) || index < 0) {
    throw new Error('Invalid image index');
  }

  const fileName = index === 0 ? 'thumbnail.webp' : `${index}.webp`;
  return `./images/${buildId}/${fileName}`;
}

export function getImagePaths(buildId: string, index: number): { full: string; thumbnail: string } {
  if (!isValidBuildId(buildId)) {
    throw new Error('Invalid build ID');
  }

  if (!Number.isInteger(index) || index < 0) {
    throw new Error('Invalid image index');
  }

  if (index === 0) {
    return {
      full: `public/images/${buildId}/thumbnail.webp`,
      thumbnail: `public/images/${buildId}/thumbnail_sm.webp`,
    };
  }
  return {
    full: `public/images/${buildId}/${index}.webp`,
    thumbnail: `public/images/${buildId}/${index}_sm.webp`,
  };
}
