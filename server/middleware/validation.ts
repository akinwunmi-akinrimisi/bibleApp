import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'Validation failed',
        details: errors.array()
      }
    });
  }
  
  next();
}

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const feedbackValidation = [
  body('transcription')
    .isLength({ min: 1, max: 1000 })
    .trim()
    .withMessage('Transcription must be 1-1000 characters'),
  body('selectedVerseId')
    .isNumeric()
    .withMessage('Selected verse ID must be numeric'),
  body('topMatches')
    .isArray({ max: 10 })
    .withMessage('Top matches must be an array of max 10 items'),
  handleValidationErrors
];

export const settingsValidation = [
  body('bibleVersion')
    .optional()
    .isIn(['KJV', 'WEB'])
    .withMessage('Bible version must be KJV or WEB'),
  body('fontSize')
    .optional()
    .isInt({ min: 12, max: 48 })
    .withMessage('Font size must be between 12 and 48'),
  body('confidenceThreshold')
    .optional()
    .isFloat({ min: 0.5, max: 1.0 })
    .withMessage('Confidence threshold must be between 0.5 and 1.0'),
  handleValidationErrors
];