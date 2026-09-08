import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { forwardRef, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useDebouncedCallback } from 'use-debounce';
import type {
  CustomerTransaction,
  ProjectPolicyOption,
} from '../../../@type/batch';
import CustomDatePicker from '../../../components/form/CustomDatePicker';
import nation from '../../../data/nationlity.json';
import { fetchDataAsync } from '../../../services/$service';
import { pluralize } from '../../../utils/pluralize';
import { ROUTE_API } from '../../../utils/route-util';
import { useModal } from '../../common/modal';
import ExistedPolicyModal from './ExistedPolicyModal';

const nationCambodia = nation.find((item) => item.nationality === 'Cambodian');

interface PolicyOption {
  label?: string;
  value?: string;
}

interface CustomPatternProps {
  value?: string;
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

// eslint-disable-next-line react/display-name
export const CustomPattern = forwardRef<HTMLInputElement, CustomPatternProps>(
  ({ value, onClick, onChange, onFocus, onKeyDown }, ref) => {
    return (
      <PatternFormat
        className="form-control"
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        format={'##-##-#####'}
        placeholder={'dd-mm-yyyy'}
        onChange={onChange}
        value={value}
        required
        onClick={onClick}
        getInputRef={ref}
      />
    );
  }
);

interface DuplicateCustomerResult {
  totalDocs?: number;
  list?: CustomerTransaction[];
}

interface CustomerCreateProps {
  productName?: string;
  project?: ProjectPolicyOption[];
  handleNextStep?: () => void;
}

const CustomerCreate = (props: CustomerCreateProps) => {
  const { productName, project, handleNextStep } = props;
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<PolicyOption[]>([]);
  const [policyDetails, setPolicyDetails] = useState<PolicyOption | null>({});
  const { register, control, handleSubmit, reset, getValues, setValue } =
    useFormContext();
  const [duplicateCustomer, setDuplicateCustomer] =
    useState<DuplicateCustomerResult | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [isUnderage, setIsUnderage] = useState(false);
  const { modalRef, openModal } = useModal();

  const goBackHandleClick = () => {
    navigate(-1);
  };

  const resetHandleClick = () => {
    reset({
      sureName: '',
      firstName: '',
      gender: '',
      dateOfBirth: '',
      nation: '',
      physicalCard: '',
      policy: '',
      project: '',
      telNo: '',
      position: '',
      identifyNumber: '',
      parentId: '',
      childrenId: '',
      openingDate: '',
    });
    setPolicy([]);
    setPolicyDetails({});
    setAge(null);
    setIsUnderage(false);
  };

  const checkDuplicateCustomer = async (_search?: string) => {
    try {
      const response = await fetchDataAsync<DuplicateCustomerResult>(
        ROUTE_API.operationCustomerDuplicate,
        {
          params: {
            nicPassport: getValues('identifyNumber'),
            customerId: getValues('childrenId'),
          },
        }
      );
      setDuplicateCustomer(response?.data ?? null);
    } catch (error) {
      console.log(error);
    }
  };

  const debouceCheckDuplicateCustomer = useDebouncedCallback(
    checkDuplicateCustomer,
    400
  );

  const handleDateChange = (
    dateString: string | null,
    onChange: (value: string) => void
  ) => {
    if (!dateString) return;

    const dob = new Date(dateString);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const ageLabel =
      years < 1
        ? `${months} M ${days} D`
        : `${years} Year${years !== 1 ? 's' : ''}`;
    setAge(ageLabel);
    setIsUnderage(years < 18);

    onChange(dateString);
  };

  useEffect(() => {
    const formData = getValues();
    if (formData.policy) {
      setPolicyDetails(formData.policy);
    }

    if (formData.project) {
      const policies = formData.project?.policies ?? [];
      setPolicy(policies);
      const hasPolicy = !!formData.policy;
      const stillValid =
        hasPolicy &&
        policies.some(
          (p: PolicyOption) => String(p.value) === String(formData.policy.value)
        );

      if (!stillValid) {
        const first = policies[0] ?? null;
        setPolicyDetails(first);
        setValue('policy', first, { shouldValidate: true });
      }
    } else {
      setPolicy([]);
      setPolicyDetails(null);
      setValue('policy', null, { shouldValidate: true });
    }

    if (formData.dateOfBirth && formData.dateOfBirth.toDate) {
      handleDateChange(formData.dateOfBirth, () => {});
    }
    console.log('Form data on init:', formData); // Debug log to check initial form data
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-body">
        <div className="container-xl">
          <div className="card">
            <div className="card-header">
              <h3>REGISTER - {productName}</h3>
            </div>
            <div className="card-body">
              {!!duplicateCustomer?.totalDocs &&
                duplicateCustomer.totalDocs > 0 && (
                  <div
                    className="alert alert-warning p-3 mt-1 mb-3 d-flex justify-content-between align-items-center"
                    role="button"
                    title="Click to view Customer Existed Policy"
                    onClick={() => openModal()}
                  >
                    <h4 className="alert-heading mb-0 text-underline">
                      This customer already has {duplicateCustomer.totalDocs}{' '}
                      {pluralize('policy', duplicateCustomer.totalDocs)}.
                    </h4>
                  </div>
                )}

              <form
                onSubmit={handleSubmit(() => {
                  handleNextStep?.();
                })}
              >
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label required">Surname</label>
                    <input
                      required
                      className="form-control"
                      {...register('sureName', { required: true })}
                      placeholder="Surname"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label required">First name</label>
                    <input
                      required
                      className="form-control"
                      {...register('firstName', { required: true })}
                      placeholder="First name"
                    />
                  </div>
                  <div className="col-md-2 mb-3">
                    <label className="form-label required">Gender</label>
                    <select
                      required
                      className="form-control"
                      {...register('gender', { required: true })}
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label required">Tel No.</label>
                    <Controller
                      name="telNo"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <PatternFormat
                          className="form-control"
                          format="### ### ### ### ### ### ###"
                          placeholder="Tel no."
                          required
                          value={value}
                          onValueChange={(data) =>
                            onChange(data.formattedValue)
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="col-md-5 mb-3">
                    <label className="form-label required">Date of Birth</label>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomDatePicker
                          value={value}
                          onChange={(date) => handleDateChange(date, onChange)}
                          required={true}
                          placeholder="dd-mm-yyyy"
                        />
                      )}
                    />
                  </div>
                  <div className="col-md-1 mb-3 text-center">
                    <label className="form-label">Age</label>
                    <div
                      className={`${
                        isUnderage
                          ? 'border border-primary text-center p-1 rounded'
                          : 'text-center p-1 pt-1'
                      }`}
                    >
                      <div>{age ? age : '_ _'}</div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label required">
                      NID/Passport Number /Birth Certi
                    </label>
                    <Controller
                      name="identifyNumber"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input
                          required
                          className="form-control"
                          {...field}
                          onKeyUp={(e) =>
                            debouceCheckDuplicateCustomer(
                              (e.target as HTMLInputElement).value
                            )
                          }
                          placeholder="NID/Passport Number /Birth Certi"
                        />
                      )}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label required">Parent CID</label>
                    <Controller
                      name="parentId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { ref, ...other } }) => (
                        <NumericFormat
                          {...other}
                          allowLeadingZeros
                          getInputRef={ref}
                          placeholder="Parent CID"
                          className="form-control"
                          required
                          onKeyUp={(e) =>
                            debouceCheckDuplicateCustomer(
                              (e.target as HTMLInputElement).value
                            )
                          }
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label required">Children CID</label>
                    <Controller
                      name="childrenId"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { ref, ...other } }) => (
                        <NumericFormat
                          {...other}
                          allowLeadingZeros
                          getInputRef={ref}
                          placeholder="Children CID"
                          className="form-control"
                          required
                          onKeyUp={(e) =>
                            debouceCheckDuplicateCustomer(
                              (e.target as HTMLInputElement).value
                            )
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label required">Nationality</label>
                    <Controller
                      name="nation"
                      control={control}
                      defaultValue={nationCambodia}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, ref } }) => (
                        <Select
                          ref={ref}
                          value={value}
                          onChange={onChange}
                          getOptionLabel={(opt) => opt.nationality}
                          options={nation}
                        />
                      )}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label required">
                        Opening Date
                      </label>
                      <Controller
                        name="openingDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomDatePicker
                            value={value}
                            onChange={(date) => onChange(date)}
                            required={true}
                            placeholder="dd-mm-yyyy"
                            includeCurrentTime={true}
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label required">Project</label>
                      <Controller
                        name="project"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, ref } }) => (
                          <Select
                            ref={ref}
                            value={value}
                            options={project}
                            getOptionLabel={(opt) => opt.label ?? ''}
                            getOptionValue={(opt) => String(opt.value)}
                            onChange={(val) => {
                              const policies = val?.policies ?? [];
                              setPolicy(policies);
                              const first = policies[0] ?? null;
                              setPolicyDetails(first);
                              setValue('policy', first, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              onChange(val);
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label required">Policy</label>
                      <Controller
                        name="policy"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, ref } }) => (
                          <Select
                            ref={ref}
                            value={value}
                            options={policy}
                            getOptionLabel={(opt) => opt.label ?? ''}
                            getOptionValue={(opt) => String(opt.value)}
                            isDisabled={!policy?.length}
                            onChange={(val) => {
                              setPolicyDetails(val);
                              onChange(val);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3" hidden>
                  <div className="form-group mb-3">
                    <label className="form-label required">Policy No.</label>
                  </div>
                  <input
                    className="form-control"
                    value={policyDetails?.value ?? ''}
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      {...register('physicalCard', { value: true })}
                    />
                    <span className="form-check-label">
                      Request Physical Card
                    </span>
                  </label>
                </div>

                <div className="form-footer">
                  <div className="btn-list">
                    <button
                      onClick={goBackHandleClick}
                      className="btn btn-secondary"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={resetHandleClick}
                    >
                      Reset
                    </button>
                    <button className="btn btn-primary" type="submit">
                      Next
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ExistedPolicyModal ref={modalRef} data={duplicateCustomer?.list} />
    </div>
  );
};

export default CustomerCreate;
