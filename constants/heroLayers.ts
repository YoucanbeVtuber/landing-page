// Layer render order (back → front) for Hero section 3D decomposition
// These filenames correspond to PNG files in /public/hero/layers/

export const HERO_LAYER_ORDER = [
  "hair_back.png",

  "fox ears.png",

  "body.png",

  // face base
  "face_skin_base.png",

  // ears (behind hair by default)
  "face_ear_l.png",
  "face_ear_r.png",

  // eyebrows / lashes
  "eyebrow_l.png",
  "eyebrow_r.png",
  "eyelash_l.png",
  "eyelash_r.png",

  // eyes: white → iris → pupil → highlight
  "eye_white_l.png",
  "eye_white_r.png",
  "eye_iris_l.png",
  "eye_iris_r.png",
  "eye_pupil_l.png",
  "eye_pupil_r.png",
  "eye_highlight_l.png",
  "eye_highlight_r.png",

  // mouth interior → tongue → teeth → lips
  "mouth_lips.png",

  "hair_front.png",
] as const;

export type LayerFileName = typeof HERO_LAYER_ORDER[number];
