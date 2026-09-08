import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useDebouncedCallback } from 'use-debounce';
import CustomDatePicker from '../../../components/form/CustomDatePicker';
import nation from '../../../data/nationlity.json';
import useMessage from '../../../hooks/useMessage';
import { fetchDataAsync } from '../../../services/$service';
import { pluralize } from '../../../utils/pluralize';
import { useModal } from '../../common/modal';
import { CustomPattern } from '../create/CustomerCreate.jsx';
import ExistedPolicyModal from '../create/ExistedPolicyModal';

const CustomerEdit = (props) => {
  const { project, handleNextStep, setProduct, closeSpinner } = props;
  const navigate = useNavigate();
  const params = useParams();
  const [policy, setPolicy] = useState([]);
  const [rejectRemark, setRejectRemark] = useState(null);
  const [policyDetails, setPolicyDetails] = useState({});
  const [isUnderage, setIsUnderage] = useState(false);
  const [age, setAge] = useState(null);
  const { register, control, handleSubmit, setValue, reset, getValues } =
    useFormContext();

  const goBackHandleClick = () => {
    navigate(-1);
  };
  const { showErrorResponseMessage } = useMessage();

  const getListDetails = async () => {
    try {
      const response = await fetchDataAsync(
        '/operation-customer?transactionCode=' + params.key
      );
      const responseData = response?.data?.list[0];
      setProduct(responseData.productName);
      const selectedProject = project?.find((item) => {
        return item.value === responseData?.projectCode;
      });
      const selectedPolicies = selectedProject?.policies?.find((item) => {
        return item.value === responseData?.policies;
      });
      if (responseData?.remark) {
        setRejectRemark(responseData.remark);
      }

      setPolicy(selectedProject?.policies);
      setPolicyDetails(selectedPolicies);
      reset({
        ...responseData,
        dateOfBirth: new Date(responseData?.dateOfBirth),
        openingDate: new Date(responseData?.openingDate ?? new Date()),
        nation: { nationality: responseData?.nation },
        project: selectedProject,
        policy: selectedPolicies,
        transactionCode: responseData.transactionCode,
      });
    } catch (error) {
      console.log(error);
      showErrorResponseMessage(error);
    } finally {
      closeSpinner();
    }
  };

  const dobWatch = useWatch({ control, name: 'dateOfBirth' });

  const handleDateChange = (input, onChange, commitToForm = true) => {
    const d = !input
      ? null
      : input?.toDate
      ? input
      : input instanceof Date
      ? dayjs(input)
      : dayjs(input, ['YYYY-MM-DD', 'DD-MM-YYYY', dayjs.ISO_8601], true);

    if (!d || !d.isValid()) {
      setAge('');
      setIsUnderage(false);
      if (commitToForm) onChange(null);
      return;
    }

    const dob = d.toDate();
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

    if (commitToForm) {
      onChange(dob);
    }
  };

  useEffect(() => {
    if (dobWatch) {
      handleDateChange(dobWatch, () => {}, false);
    }
  }, [dobWatch]);

  useEffect(() => {
    if (!project || !project.length) return;

    const isCreate = !getValues('firstName');
    if (isCreate) {
      getListDetails();
    }

    const selectedProject = getValues('project') || null;
    const currentPolicy = getValues('policy') || null;

    setRejectRemark(getValues('remark'));
    debouceCheckDuplicateCustomer();
    if (!selectedProject) {
      setPolicy([]);
      setPolicyDetails(null);
      setValue('policy', null, { shouldValidate: true, shouldDirty: true });
      return;
    }

    const policies = selectedProject.policies ?? [];
    setPolicy(policies);

    if (policies.length === 0) {
      setPolicyDetails(null);
      setValue('policy', null, { shouldValidate: true, shouldDirty: true });
      return;
    }

    const currentIsValid =
      currentPolicy &&
      policies.some((p) => String(p.value) === String(currentPolicy.value));

    const nextPolicy = currentIsValid ? currentPolicy : policies[0];

    setValue('policy', nextPolicy, { shouldValidate: true, shouldDirty: true });
    setPolicyDetails(nextPolicy);
  }, [project]);

  const [duplicateCustomer, setDuplicateCustomer] = useState(null);

  const checkDuplicateCustomer = async () => {
    try {
      const response = await fetchDataAsync('/operation-customer/duplicate', {
        params: {
          nicPassport: getValues('nicPassport'),
          customerId: getValues('customerId'),
        },
      });
      setDuplicateCustomer(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const debouceCheckDuplicateCustomer = useDebouncedCallback(
    checkDuplicateCustomer,
    400
  );

  const { modalRef, openModal } = useModal();
  return (
    <div className="page-wrapper">
      <div className="page-body">
        <div className="container-xl">
          <div className="card">
            <div className="card-header">
              <h3>Modify Register</h3>
            </div>
            <div className="card-body">
              {rejectRemark && (
                <div className="alert alert-danger mt-1 mb-3" role="alert">
                  <h5 className="alert-heading">Rejected Remark</h5>
                  <p>{rejectRemark}</p>
                </div>
              )}
              {duplicateCustomer?.totalDocs > 0 && (
                <div
                  className="alert cursor-pointer alert-warning p-3 mt-1 mb-3 d-flex justify-content-between align-items-center"
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
                  handleNextStep();
                })}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label required">Surname</label>
                    </div>
                    <input
                      className="form-control"
                      {...register('sureName', { required: true })}
                    />
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label className="form-label required">First name</label>
                    </div>
                    <input
                      className="form-control"
                      {...register('firstName', { required: true })}
                      placeholder="First name"
                    />
                  </div>
                  <div className="col-md-2">
                    <div className="form-group mb-3">
                      <label className="form-label required">Gender</label>
                    </div>
                    <select
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
                <div className="mt-10">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label required">Tel No.</label>
                      </div>
                      <Controller
                        name="telNo"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <PatternFormat
                              cursor="pointer"
                              type="text"
                              className="form-control"
                              placeholder="Tel no."
                              required
                              format="### ### ### ### ### ### ###"
                              value={value}
                              onValueChange={(data) => {
                                onChange(data.formattedValue);
                              }}
                            />
                          );
                        }}
                      ></Controller>
                    </div>
                    <div className="col-md-5 mb-3">
                      <label className="form-label required">
                        Date of Birth
                      </label>
                      <Controller
                        name="dateOfBirth"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomDatePicker
                            label=""
                            value={value ? dayjs(value) : null}
                            onChange={(date) =>
                              handleDateChange(date, onChange, true)
                            } // <-- counts age + updates form
                            required
                            placeholder="dd-mm-yyyy"
                          />
                        )}
                      />
                    </div>

                    <div className="col-md-1 mb-3 text-center">
                      <label className="form-label">Age</label>
                      <div
                        className={
                          isUnderage
                            ? 'border border-primary text-center p-1 rounded'
                            : 'text-center p-1 pt-1'
                        }
                      >
                        <div>{age ? age : '_ _'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label required">
                          NID/Passport Number /Birth Certi
                        </label>
                      </div>
                      <input
                        className="form-control"
                        {...register('nicPassport', { required: true })}
                        onKeyUp={(e) => {
                          debouceCheckDuplicateCustomer(e.target.value);
                        }}
                        placeholder="NIC/Passport"
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
                              debouceCheckDuplicateCustomer(e.target.value)
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label required">
                          Children CID
                        </label>
                      </div>
                      <Controller
                        name="customerId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { ref, ...other } }) => {
                          return (
                            <NumericFormat
                              {...other}
                              onKeyUp={(e) => {
                                debouceCheckDuplicateCustomer(e.target.value);
                              }}
                              getInputRef={ref}
                              placeholder="Children ID"
                              className="form-control"
                            />
                          );
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label required">
                          Nationality
                        </label>
                      </div>
                      <Controller
                        name="nation"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, ref } }) => {
                          return (
                            <Select
                              ref={ref}
                              value={value}
                              onChange={onChange}
                              isOptionSelected={(option, value) =>
                                option.nationality === value.nationality
                              }
                              getOptionLabel={(option) => option.nationality}
                              options={nation}
                            />
                          );
                        }}
                      ></Controller>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label required">
                          Customer ID
                        </label>
                      </div>
                      <Controller
                        name="customerId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { ref, ...other } }) => {
                          return (
                            <NumericFormat
                              {...other}
                              onKeyUp={(e) => {
                                debouceCheckDuplicateCustomer(e.target.value);
                              }}
                              getInputRef={ref}
                              placeholder="Customer ID"
                              className="form-control"
                            />
                          );
                        }}
                      />
                    </div> */}
                  </div>
                </div>
                <div className="mt-10">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label className="form-label required">
                          Opening Date
                        </label>
                      </div>
                      <Controller
                        render={({ field: { value, onChange } }) => {
                          return (
                            <ReactDatePicker
                              maxDate={new Date()}
                              minDate={new Date('1900-01-01')}
                              onChange={onChange}
                              selected={value}
                              className="form-control"
                              showMonthDropdown
                              tabIndex={1}
                              dateFormat="dd-MM-yyyy"
                              placeholderText="dd-mm-yyyy"
                              required
                              customInput={<CustomPattern />}
                            />
                          );
                        }}
                        name={'openingDate'}
                        control={control}
                        rules={{ required: true }}
                      />
                    </div>

                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label className="form-label required">Project</label>
                      </div>
                      <Controller
                        name="project"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, ref } }) => (
                          <Select
                            ref={ref}
                            value={value}
                            onChange={(selectedProject) => {
                              // set available policies
                              setPolicy(selectedProject.policies);

                              // auto-pick first policy if available
                              if (
                                selectedProject.policies &&
                                selectedProject.policies.length > 0
                              ) {
                                const firstPolicy = selectedProject.policies[0];
                                setPolicyDetails(firstPolicy);
                                setValue('policy', firstPolicy); // ✅ auto-select first policy
                              } else {
                                setValue('policy', null);
                              }

                              // update project field
                              onChange(selectedProject);
                            }}
                            getOptionLabel={(option) => option.label}
                            options={project}
                          />
                        )}
                      />
                    </div>

                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label className="form-label required">Policy</label>
                      </div>
                      <Controller
                        name="policy"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, ref } }) => (
                          <Select
                            ref={ref}
                            value={value}
                            onChange={(selectedPolicy) => {
                              setPolicyDetails(selectedPolicy);
                              onChange(selectedPolicy);
                            }}
                            getOptionLabel={(option) => option.label}
                            options={policy}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <div className="col-md-6">
                    <label className="form-check">
                      <Controller
                        name="physicalCard"
                        control={control}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={value}
                              checked={value === 'true'}
                              onChange={(e) => {
                                onChange(String(e.target.checked));
                              }}
                            />
                          );
                        }}
                      />
                      <span className="form-check-label">
                        Request Physical Card
                      </span>
                    </label>
                  </div>
                </div>
                <div className="mt-30" hidden>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label required">
                          Policy No.
                        </label>
                      </div>
                      <input
                        className="form-control"
                        value={policyDetails?.value ?? ''}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label required">
                          Policy Expiry Date
                        </label>
                      </div>
                      <input
                        className="form-control"
                        value={policyDetails?.policyExpireDate ?? ''}
                        readOnly
                      />
                    </div>
                  </div>
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

export default CustomerEdit;
