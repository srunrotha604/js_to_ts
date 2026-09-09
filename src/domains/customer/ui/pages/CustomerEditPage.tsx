import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner, { useSpinner } from '../../../../components/common/Spinner';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { ProjectPolicyOption } from '../../entities';
import { fetchPoliciesByProductCode } from '../../interface-adapters';
import CostomerTransationSubmit from '../components/create/CustomerTransationSubmit';
import CustomerEdit from '../components/edit/CustomerEdit';
import CustomerEditReview from '../components/edit/CustomerEditReview';

const STEP = {
  Edited: 'Edited',
  Review: 'Review',
  Submitted: 'Submitted',
};

const CustomerEditPage = () => {
  document.title = 'E-CHANNEL PORTAL | customer edit';
  const params = useParams();

  const [product, setProduct] = useState('');
  const [arrProject, setArrProject] = useState<ProjectPolicyOption[]>([]);
  const [transactionSubmitted, setTransationSubmitted] = useState<unknown>({});
  const [step, setStep] = useState(STEP.Edited);
  const methods = useForm();
  const navigate = useNavigate();
  const getList = () => {
    fetchPoliciesByProductCode(params.productCode ?? '').then((res) => {
      switch (res?.status) {
        case 200:
          setArrProject(res?.data?.category ?? []);
          break;
        case 400:
          toast.error(res?.data?.message ?? '');
          break;
        case 403:
          toast.error(String(res?.data));
          break;
        default:
          navigate(ROUTE_PATH.notFound);
      }
    });
  };

  const { spinnerState, openSpinner, closeSpinner } = useSpinner();

  useEffect(() => {
    openSpinner();
    getList();
  }, []);

  const getActiveStep = () => {
    switch (step) {
      case STEP.Review:
        return (
          <CustomerEditReview
            handleBackStep={handleBackStep}
            handleSubmitted={handleSubmitted}
            productName={product}
          />
        );
      case STEP.Submitted:
        return (
          <CostomerTransationSubmit
            productName={product}
            data={transactionSubmitted}
          />
        );
      default:
        return (
          <CustomerEdit
            closeSpinner={closeSpinner}
            setProduct={setProduct}
            project={arrProject}
            handleNextStep={handleNextStep}
          />
        );
    }
  };

  const handleNextStep = () => {
    setStep(STEP.Review);
  };

  const handleSubmitted = (
    responseData: unknown,
    submitData: { status?: string }
  ) => {
    if (submitData.status === 'Draft') {
      navigate(-1);
    } else {
      setTransationSubmitted(responseData);
      setStep(STEP.Submitted);
    }
  };

  const handleBackStep = () => {
    setStep(STEP.Edited);
  };

  return (
    <FormProvider {...methods}>
      <Spinner {...spinnerState} />
      <div className="page-wrapper full-height-dashboard-container">
        {getActiveStep()}
      </div>
    </FormProvider>
  );
};

export default CustomerEditPage;
