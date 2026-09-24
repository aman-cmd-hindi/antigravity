import { describe, it, expect } from 'vitest';

export function validateEnrollmentForm({ name, phone, course, standard }) {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Full student name is required (minimum 2 characters)';
  }

  // Indian 10-digit mobile number format check: starts with 6, 7, 8, or 9
  const phoneClean = (phone || '').replace(/\D/g, '');
  if (!phoneClean) {
    errors.phone = 'Phone number is required';
  } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number';
  }

  if (!course || course.trim().length === 0) {
    errors.course = 'Please select an academic course track';
  }

  if (!standard || standard.trim().length === 0) {
    errors.standard = 'Please specify current class or standard';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

describe('Enrollment Form Input Validation Engine', () => {
  it('validates a correct enrollment submission', () => {
    const payload = {
      name: 'Aarav Sharma',
      phone: '9876543210',
      course: 'MHT-CET Comprehensive',
      standard: '12th Science'
    };
    const { isValid, errors } = validateEnrollmentForm(payload);
    expect(isValid).toBe(true);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('rejects an invalid phone number', () => {
    const payload = {
      name: 'Aarav Sharma',
      phone: '12345', // Too short and doesn't start with 6-9
      course: 'MHT-CET',
      standard: '12th'
    };
    const { isValid, errors } = validateEnrollmentForm(payload);
    expect(isValid).toBe(false);
    expect(errors.phone).toBeDefined();
  });

  it('accepts formatted phone numbers like +91 or hyphens', () => {
    const payload = {
      name: 'Rohan Patil',
      phone: '98-3318-7969',
      course: 'NEET Foundation',
      standard: '11th'
    };
    const { isValid } = validateEnrollmentForm(payload);
    expect(isValid).toBe(true);
  });

  it('rejects empty name and missing course', () => {
    const payload = {
      name: '',
      phone: '8779560903',
      course: '',
      standard: '10th'
    };
    const { isValid, errors } = validateEnrollmentForm(payload);
    expect(isValid).toBe(false);
    expect(errors.name).toBeDefined();
    expect(errors.course).toBeDefined();
  });
});
