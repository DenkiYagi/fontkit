// @ts-check

import * as Script from '../layout/Script';

/**
 * ShapingPlans are used by the OpenType shapers to store which
 * features should by applied, and in what order to apply them.
 * The features are applied in groups called stages. A feature
 * can be applied globally to all glyphs, or locally to only
 * specific glyphs.
 *
 * @private
 */
export default class ShapingPlan {
  /**
   * @param {import("../types").TTFFont} font 
   * @param {string} script 
   * @param {'ltr' | 'rtl'} direction 
   */
  constructor(font, script, direction) {
    this.font = font;
    this.script = script;
    this.direction = direction;

    /**
     * @type {import("../types").ShapingPlanStage[]}
     */
    this.stages = [];

    this.globalFeatures = {};
    this.allFeatures = {};
  }

  /**
   * Adds the given features to the last stage.
   * Ignores features that have already been applied.
   * 
   * @param {string[]} features
   * @param {boolean} global
   */
  _addFeatures(features, global) {
    let stageIndex = this.stages.length - 1;
    let stage = this.stages[stageIndex];
    if (Array.isArray(stage)) {
      for (let feature of features) {
        if (this.allFeatures[feature] == null) {
          stage.push(feature);
          this.allFeatures[feature] = stageIndex;
  
          if (global) {
            this.globalFeatures[feature] = true;
          }
        }
      }
    } else {
      throw new Error("Invalid data type of stage in ShapingPlan#stages");
    }
  }

  /**
   * Add features to the last stage
   * 
   * @param {string | string[] | {global?: string[], local?: string[]}} arg
   * @param {boolean} [global]
   */
  add(arg, global = true) {
    if (this.stages.length === 0) {
      this.stages.push([]);
    }

    if (typeof arg === 'string') {
      arg = [arg];
    }

    if (Array.isArray(arg)) {
      this._addFeatures(arg, global);
    } else if (typeof arg === 'object') {
      this._addFeatures(arg.global || [], true);
      this._addFeatures(arg.local || [], false);
    } else {
      throw new Error("Unsupported argument to ShapingPlan#add");
    }
  }

  /**
   * Add a new stage
   * 
   * @param {import("../types").ShapingPlanStageFunction | string | string[] | {global?: string[], local?: string[]}} arg
   * @param {boolean} [global]
   */
  addStage(arg, global) {
    if (typeof arg === 'function') {
      this.stages.push(arg, []);
    } else {
      this.stages.push([]);
      this.add(arg, global);
    }
  }

  /**
   * @param {string[] | Record<string, boolean>} features 
   */
  setFeatureOverrides(features) {
    if (Array.isArray(features)) {
      this.add(features);
    } else if (typeof features === 'object') {
      for (let tag in features) {
        if (features[tag]) {
          this.add(tag);
        } else if (this.allFeatures[tag] != null) {
          let stage = this.stages[this.allFeatures[tag]];
          if (Array.isArray(stage)) {
            stage.splice(stage.indexOf(tag), 1);
            delete this.allFeatures[tag];
            delete this.globalFeatures[tag];
          } else {
            throw new Error("Invalid data type of stage in ShapingPlan#stages");
          }
        }
      }
    }
  }

  /**
   * Assigns the global features to the given glyphs
   * 
   * @param {import("./GlyphInfo").default[]} glyphs
   */
  assignGlobalFeatures(glyphs) {
    for (let glyph of glyphs) {
      for (let feature in this.globalFeatures) {
        glyph.features[feature] = true;
      }
    }
  }

  /**
   * Executes the planned stages using the given OTProcessor
   * 
   * @param {import("./OTProcessor").default} processor
   * @param {import("./GlyphInfo").default[]} glyphs
   * @param {*} [positions]
   */
  process(processor, glyphs, positions) {
    for (let stage of this.stages) {
      if (typeof stage === 'function') {
        if (!positions) {
          stage(this.font, glyphs, this);
        }

      } else if (stage.length > 0) {
        processor.applyFeatures(stage, glyphs, positions);
      }
    }
  }
}
