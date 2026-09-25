import type { SecurityPolicy } from '../entities';

export const DEFAULT_SECURITY_POLICY: SecurityPolicy = {
  minimumPasswordLength: 14,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecialCharacter: true,
};

export interface PasswordRequirementCheck {
  label: string;
  met: boolean;
}

export const getPasswordRequirementChecks = (
  password: string,
  policy: SecurityPolicy = DEFAULT_SECURITY_POLICY
): PasswordRequirementCheck[] => {
  const minLength = policy.minimumPasswordLength ?? 8;
  const checks: PasswordRequirementCheck[] = [
    {
      label: `At least ${minLength} characters`,
      met: password.length >= minLength,
    },
  ];

  if (policy.requireUppercase) {
    checks.push({
      label: 'One uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
    });
  }
  if (policy.requireLowercase) {
    checks.push({
      label: 'One lowercase letter (a-z)',
      met: /[a-z]/.test(password),
    });
  }
  if (policy.requireDigit) {
    checks.push({ label: 'One number (0-9)', met: /[0-9]/.test(password) });
  }
  if (policy.requireSpecialCharacter) {
    checks.push({
      label: 'One special character (!@#$...)',
      met: /[#?!@$%^&*-]/.test(password),
    });
  }

  return checks;
};

export type PasswordStrengthLabel = 'WEAK' | 'FAIR' | 'GOOD' | 'STRONG';

export const getPasswordStrengthLabel = (
  checks: PasswordRequirementCheck[]
): PasswordStrengthLabel => {
  if (checks.length === 0) return 'WEAK';
  const ratio = checks.filter((c) => c.met).length / checks.length;
  if (ratio >= 1) return 'STRONG';
  if (ratio >= 0.75) return 'GOOD';
  if (ratio >= 0.4) return 'FAIR';
  return 'WEAK';
};

export const validatePasswordStrength = (
  password: string,
  policy: SecurityPolicy = DEFAULT_SECURITY_POLICY
): boolean => {
  const maxLength = policy.maximumPasswordLength;
  if (maxLength && password.length > maxLength) return false;
  return getPasswordRequirementChecks(password, policy).every((c) => c.met);
};

export const buildPasswordPolicyMessage = (
  policy: SecurityPolicy = DEFAULT_SECURITY_POLICY
): string => {
  const requirements: string[] = [];
  if (policy.requireUppercase) requirements.push('1 uppercase letter');
  if (policy.requireLowercase) requirements.push('1 lowercase letter');
  if (policy.requireDigit) requirements.push('1 number');
  if (policy.requireSpecialCharacter) requirements.push('1 special character');

  const minLength = policy.minimumPasswordLength ?? 8;
  const requirementText = requirements.length
    ? `, including at least ${requirements.join(', ')}`
    : '';

  return `Password must have at least ${minLength} characters${requirementText}`;
};
