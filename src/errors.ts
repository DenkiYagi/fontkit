/**
 * Error type codes recognized by `@denkiyagi/fontkit`.
 */
export const FontkitErrorTypes = {
  /** @see {@link UnsupportedFontFileFormatError} */
  UNSUPPORTED_FONT_FILE_FORMAT: 'UNSUPPORTED_FONT_FILE_FORMAT',

  /** @see {@link UnsupportedFontDataError} */
  UNSUPPORTED_FONT_DATA: 'UNSUPPORTED_FONT_DATA',

  /** @see {@link InvalidFontDataError} */
  INVALID_FONT_DATA: 'INVALID_FONT_DATA',

  /** @see {@link InvalidCallerInputError} */
  INVALID_CALLER_INPUT: 'INVALID_CALLER_INPUT',

  /** @see {@link AssertionError} */
  ASSERTION: 'ASSERTION',
} as const;

/**
 * Error type code recognized by `@denkiyagi/fontkit`.
 */
export type FontkitErrorType = typeof FontkitErrorTypes[keyof typeof FontkitErrorTypes];

/**
 * Error explicitly thrown by `@denkiyagi/fontkit`.
 */
export class FontkitError extends Error {
  /**
   * Machine-readable classification for the failure.
   */
  readonly type: FontkitErrorType;

  constructor(type: FontkitErrorType, message: string, options?: ErrorOptions) {
    super(message, options);

    this.name = new.target.name;
    this.type = type;
  }
}

/**
 * Buffer cannot be recognized as any supported font container,
 * or represents a packaging variant we intentionally do not handle.
 */
export class UnsupportedFontFileFormatError extends FontkitError {
  constructor(message: string, options?: ErrorOptions) {
    super(FontkitErrorTypes.UNSUPPORTED_FONT_FILE_FORMAT, message, options);
  }
}

/**
 * The font decodes successfully but requests optional tables/features that
 * our engine has not implemented yet (e.g., cmap format 8, GSUB lookup type 8).
 */
export class UnsupportedFontDataError extends FontkitError {
  constructor(message: string, options?: ErrorOptions) {
    super(FontkitErrorTypes.UNSUPPORTED_FONT_DATA, message, options);
  }
}

/**
 * Encoded data violates the applicable specification or is structurally
 * inconsistent (bad offsets, illegal operators, corrupt tuples, ...).
 */
export class InvalidFontDataError extends FontkitError {
  constructor(message: string, options?: ErrorOptions) {
    super(FontkitErrorTypes.INVALID_FONT_DATA, message, options);
  }
}

/**
 * Public API or shared helper received parameters outside its contract
 * (wrong types, missing setup call, unsupported descriptors).
 * Caller may be user code or an upstream subsystem.
 *
 * Scenarios that can only be triggered by internal misuse (no external entry point)
 * are classified as `AssertionError` instead.
 */
export class InvalidCallerInputError extends FontkitError {
  constructor(message: string, options?: ErrorOptions) {
    super(FontkitErrorTypes.INVALID_CALLER_INPUT, message, options);
  }
}

/**
 * Invariant breach that can only originate from an internal bug;
 * the scenario should never happen when inputs are valid.
 */
export class AssertionError extends FontkitError {
  constructor(message: string, options?: ErrorOptions) {
    super(FontkitErrorTypes.ASSERTION, message, options);
  }
}
