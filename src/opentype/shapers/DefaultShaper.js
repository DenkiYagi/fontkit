// @ts-check

const VARIATION_FEATURES = ['rvrn'];
const COMMON_FEATURES = ['ccmp', 'locl', 'rlig', 'mark', 'mkmk'];
const HORIZONTAL_FEATURES = ['calt', 'clig', 'liga', 'rclt', 'curs', 'kern'];

export default class DefaultShaper {
  /**
   * @type {'NONE' | 'BEFORE_GPOS' | 'AFTER_GPOS'}
   */
  zeroMarkWidths = 'AFTER_GPOS';

  /**
   * @param {import('../ShapingPlan').default} plan
   * @param {import('../GlyphInfo').default[]} glyphs
   * @param {string[] | Record<string, boolean>} features
   */
  plan(plan, glyphs, features) {
    // Plan the features we want to apply
    this.planPreprocessing(plan);
    this.planFeatures(plan);
    this.planPostprocessing(plan, features);

    // Assign the global features to all the glyphs
    plan.assignGlobalFeatures(glyphs);

    // Assign local features to glyphs
    this.assignFeatures(plan, glyphs);
  }

  /**
   * @param {import('../ShapingPlan').default} plan
   */
  planPreprocessing(plan) {
    plan.add(VARIATION_FEATURES);
  }

  /**
   * @param {import('../ShapingPlan').default} plan
   */
  planFeatures(plan) {
    // Do nothing by default. Let subclasses override this.
  }

  /**
   * @param {import('../ShapingPlan').default} plan
   * @param {string[] | Record<string, boolean>} userFeatures
   */
  planPostprocessing(plan, userFeatures) {
    plan.add([...COMMON_FEATURES, ...HORIZONTAL_FEATURES]);
    plan.setFeatureOverrides(userFeatures);
  }

  /**
   * @param {import('../ShapingPlan').default} plan
   * @param {import('../GlyphInfo').default[]} glyphs
   */
  assignFeatures(plan, glyphs) {
    // Do nothing by default. Let subclasses override this.
  }
}
