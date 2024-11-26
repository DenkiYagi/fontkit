// @ts-check

import DefaultShaper from './DefaultShaper';
import ArabicShaper from './ArabicShaper';
import HangulShaper from './HangulShaper';
import IndicShaper from './IndicShaper';
import UniversalShaper from './UniversalShaper';

const defaultShaper = new DefaultShaper();
const arabicShaper = new ArabicShaper();
const hangulShaper = new HangulShaper();
const indicShaper = new IndicShaper();
const universalShaper = new UniversalShaper();

const SHAPERS = {
  arab: arabicShaper,    // Arabic
  mong: arabicShaper,    // Mongolian
  syrc: arabicShaper,    // Syriac
  'nko ': arabicShaper,  // N'Ko
  phag: arabicShaper,    // Phags Pa
  mand: arabicShaper,    // Mandaic
  mani: arabicShaper,    // Manichaean
  phlp: arabicShaper,    // Psalter Pahlavi

  hang: hangulShaper,    // Hangul

  bng2: indicShaper,     // Bengali
  beng: indicShaper,     // Bengali
  dev2: indicShaper,     // Devanagari
  deva: indicShaper,     // Devanagari
  gjr2: indicShaper,     // Gujarati
  gujr: indicShaper,     // Gujarati
  guru: indicShaper,     // Gurmukhi
  gur2: indicShaper,     // Gurmukhi
  knda: indicShaper,     // Kannada
  knd2: indicShaper,     // Kannada
  mlm2: indicShaper,     // Malayalam
  mlym: indicShaper,     // Malayalam
  ory2: indicShaper,     // Oriya
  orya: indicShaper,     // Oriya
  taml: indicShaper,     // Tamil
  tml2: indicShaper,     // Tamil
  telu: indicShaper,     // Telugu
  tel2: indicShaper,     // Telugu
  khmr: indicShaper,     // Khmer

  bali: universalShaper, // Balinese
  batk: universalShaper, // Batak
  brah: universalShaper, // Brahmi
  bugi: universalShaper, // Buginese
  buhd: universalShaper, // Buhid
  cakm: universalShaper, // Chakma
  cham: universalShaper, // Cham
  dupl: universalShaper, // Duployan
  egyp: universalShaper, // Egyptian Hieroglyphs
  gran: universalShaper, // Grantha
  hano: universalShaper, // Hanunoo
  java: universalShaper, // Javanese
  kthi: universalShaper, // Kaithi
  kali: universalShaper, // Kayah Li
  khar: universalShaper, // Kharoshthi
  khoj: universalShaper, // Khojki
  sind: universalShaper, // Khudawadi
  lepc: universalShaper, // Lepcha
  limb: universalShaper, // Limbu
  mahj: universalShaper, // Mahajani
  // mand: universalShaper, // Mandaic
  // mani: universalShaper, // Manichaean
  mtei: universalShaper, // Meitei Mayek
  modi: universalShaper, // Modi
  // mong: universalShaper, // Mongolian
  // 'nko ': universalShaper, // N’Ko
  hmng: universalShaper, // Pahawh Hmong
  // phag: universalShaper, // Phags-pa
  // phlp: universalShaper, // Psalter Pahlavi
  rjng: universalShaper, // Rejang
  saur: universalShaper, // Saurashtra
  shrd: universalShaper, // Sharada
  sidd: universalShaper, // Siddham
  sinh: indicShaper, // Sinhala
  sund: universalShaper, // Sundanese
  sylo: universalShaper, // Syloti Nagri
  tglg: universalShaper, // Tagalog
  tagb: universalShaper, // Tagbanwa
  tale: universalShaper, // Tai Le
  lana: universalShaper, // Tai Tham
  tavt: universalShaper, // Tai Viet
  takr: universalShaper, // Takri
  tibt: universalShaper, // Tibetan
  tfng: universalShaper, // Tifinagh
  tirh: universalShaper, // Tirhuta

  latn: defaultShaper,   // Latin
  DFLT: defaultShaper    // Default
};

/**
 * @param {string | string[]} script 
 * @returns {import("../../types").Shaper}
 */
export function choose(script) {
  if (!Array.isArray(script)) {
    script = [script];
  }

  for (let s of script) {
    let shaper = SHAPERS[s];
    if (shaper) {
      return shaper;
    }
  }

  return defaultShaper;
}
