// @ts-check

import ShapingPlan from './ShapingPlan';
import * as Shapers from './shapers/index';
import GlyphInfo from './GlyphInfo';
import GSUBProcessor from './GSUBProcessor';
import GPOSProcessor from './GPOSProcessor';

export default class OTLayoutEngine {
  /**
   * @param {import('../TTFFont').default} font 
   */
  constructor(font) {
    this.font = font;
    this.glyphInfos = null;
    this.plan = null;
    this.GSUBProcessor = null;
    this.GPOSProcessor = null;
    this.fallbackPosition = true;

    if (font.GSUB) {
      this.GSUBProcessor = new GSUBProcessor(font, font.GSUB);
    }

    if (font.GPOS) {
      this.GPOSProcessor = new GPOSProcessor(font, font.GPOS);
    }
  }

  /**
   * @param {import('../layout/GlyphRun').default} glyphRun 
   * @param {import('../types').Shaper} [shaper]
   */
  setup(glyphRun, shaper) {
    // Map glyphs to GlyphInfo objects so data can be passed between
    // GSUB and GPOS without mutating the real (shared) Glyph objects.
    this.glyphInfos = glyphRun.glyphs.map(glyph => new GlyphInfo(this.font, glyph.id, [...glyph.codePoints]));

    // Select a script based on what is available in GSUB/GPOS.
    let script = null;
    if (this.GPOSProcessor) {
      script = this.GPOSProcessor.selectScript(glyphRun.script, glyphRun.language, glyphRun.direction);
    }

    if (this.GSUBProcessor) {
      script = this.GSUBProcessor.selectScript(glyphRun.script, glyphRun.language, glyphRun.direction);
    }

    // Choose a shaper based on the script (if not provided), and setup a shaping plan.
    // This determines which features to apply to which glyphs.
    this.shaper = shaper ?? Shapers.choose(script);
    this.plan = new ShapingPlan(this.font, script, glyphRun.direction);
    this.shaper.plan(this.plan, this.glyphInfos, glyphRun.features);

    // Assign chosen features to output glyph run
    for (let key in this.plan.allFeatures) {
      glyphRun.features[key] = true;
    }
  }

  /**
   * @param {import('../layout/GlyphRun').default} glyphRun 
   */
  substitute(glyphRun) {
    if (this.glyphInfos == null || this.plan == null) {
      throw new Error('setup() must be called before substitute()');
    }

    if (this.GSUBProcessor) {
      this.plan.process(this.GSUBProcessor, this.glyphInfos);

      // Map glyph infos back to normal Glyph objects
      glyphRun.glyphs = this.glyphInfos.map(glyphInfo => this.font.getGlyph(glyphInfo.id, glyphInfo.codePoints));
    }
  }

  /**
   * @param {import('../layout/GlyphRun').default} glyphRun
   * @returns {(Record<string, any> | null)} GPOSProcessor#features
   */
  position(glyphRun) {
    if (this.glyphInfos == null || this.plan == null || this.shaper == null) {
      throw new Error('setup() must be called before position()');
    }

    let appliedFeatures = null;
  
    if (glyphRun.positions != null) {
      if (this.shaper.zeroMarkWidths === 'BEFORE_GPOS') {
        this.zeroMarkAdvances(glyphRun.positions);
      }
  
      if (this.GPOSProcessor) {
        this.plan.process(this.GPOSProcessor, this.glyphInfos, glyphRun.positions);
      }
  
      if (this.shaper.zeroMarkWidths === 'AFTER_GPOS') {
        this.zeroMarkAdvances(glyphRun.positions);
      }

      appliedFeatures = this.GPOSProcessor && this.GPOSProcessor.features;
    }

    // Reverse the glyphs and positions if the script is right-to-left
    if (glyphRun.direction === 'rtl') {
      glyphRun.glyphs.reverse();
      if (glyphRun.positions != null) glyphRun.positions.reverse();
    }

    return appliedFeatures;
  }

  /**
   * 
   * @param {import('../layout/GlyphPosition').default[]} positions 
   */
  zeroMarkAdvances(positions) {
    if (this.glyphInfos == null) {
      throw new Error('setup() must be called before zeroMarkAdvances()');
    }

    for (let i = 0; i < this.glyphInfos.length; i++) {
      if (this.glyphInfos[i].isMark) {
        positions[i].xAdvance = 0;
        positions[i].yAdvance = 0;
      }
    }
  }

  cleanup() {
    this.glyphInfos = null;
    this.plan = null;
    this.shaper = null;
  }

  /**
   * @param {string} [script] 
   * @param {string} [language] 
   * @returns {string[]}
   */
  getAvailableFeatures(script, language) {
    let features = [];

    if (this.GSUBProcessor) {
      this.GSUBProcessor.selectScript(script, language);
      features.push(...Object.keys(this.GSUBProcessor.features));
    }

    if (this.GPOSProcessor) {
      this.GPOSProcessor.selectScript(script, language);
      features.push(...Object.keys(this.GPOSProcessor.features));
    }

    return features;
  }
}
