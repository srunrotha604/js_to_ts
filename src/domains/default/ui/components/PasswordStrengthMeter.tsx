import { AiOutlineCheckCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import type { SecurityPolicy } from '../../entities';
import {
  DEFAULT_SECURITY_POLICY,
  getPasswordRequirementChecks,
  getPasswordStrengthLabel,
} from '../../use-cases';
interface PasswordStrengthMeterProps {
  password: string;
  policy?: SecurityPolicy;
}
const STRENGTH_STYLE: Record<string, { color: string; width: string }> = {
  WEAK: { color: '#d63939', width: '25%' },
  FAIR: { color: '#f76707', width: '50%' },
  GOOD: { color: '#4263eb', width: '75%' },
  STRONG: { color: '#2fb344', width: '100%' },
};
const PasswordStrengthMeter = ({
  password,
  policy = DEFAULT_SECURITY_POLICY,
}: PasswordStrengthMeterProps) => {
  if (!password) return null;
  const checks = getPasswordRequirementChecks(password, policy);
  const strength = getPasswordStrengthLabel(checks);
  const style = STRENGTH_STYLE[strength];
  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="text-muted small">Password Strength:</span>
        <span className="small fw-bold" style={{ color: style.color }}>
          {strength}
        </span>
      </div>
      <div className="progress" style={{ height: 6 }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: style.width, backgroundColor: style.color }}
        />
      </div>
      <div className="row mt-2 gx-2">
        {checks.map((check) => (
          <div
            className="col-6 d-flex align-items-center gap-1 mb-1"
            key={check.label}
          >
            {check.met ? (
              <AiOutlineCheckCircle color="#2fb344" />
            ) : (
              <AiOutlineMinusCircle className="text-muted" />
            )}
            <span
              className={`small ${check.met ? 'text-success' : 'text-muted'}`}
            >
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PasswordStrengthMeter;
