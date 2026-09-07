import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '../../services/$service';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import CustomerCreate from '../../components/customer/create/CustomerCreate';
import CustomerCreateReview from '../../components/customer/create/CustomerCreateReview';
import CostomerTransationSubmit from '../../components/customer/create/CustomerTransationSubmit';
import { ROUTE_PATH } from '../../utils/route-util';

const STEP = {
  Create: 'create',
  Review: 'Review',
  Submitted: 'Submitted',
};

const CustomerCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | customer create';
  const params = useParams();
  const navigate = useNavigate();

  const [arrProduct, setArrProduct] = useState([]);
  const [arrProject, setArrProject] = useState([]);
  const [transactionSubmitted, setTransationSubmitted] = useState({});
  const [step, setStep] = useState(STEP.Create);
  const methods = useForm();

  const getList = () => {
    fetchData('/operation-customer/product/' + params.key, {}, 'GET').then(
      (res) => {
        switch (res.status) {
          case 200:
            setArrProduct(
              res?.data?.list?.find(
                (item) => item?.productsequenceCode === params.key
              )
            );
            setArrProject(res?.data?.category);
            break;
          case 400:
            toast.error(res?.data?.message);
            break;
          case 403:
            toast.error(res?.data);
            break;
          default:
            navigate(ROUTE_PATH.notFound);
        }
      }
    );
  };

  useEffect(() => {
    {
      getList();
    }
  }, []);

  const getActiveStep = () => {
    switch (step) {
      case STEP.Review:
        return (
          <CustomerCreateReview
            productName={arrProduct?.productName}
            handleBackStep={handleBackStep}
            handleSubmitted={handleSubmitted}
          />
        );
      case STEP.Submitted:
        return (
          <CostomerTransationSubmit
            productName={arrProduct?.productName}
            data={transactionSubmitted}
          />
        );
      default:
        return (
          <CustomerCreate
            productName={arrProduct?.productName}
            project={arrProject}
            handleNextStep={handleNextStep}
          />
        );
    }
  };

  const handleNextStep = () => {
    setStep(STEP.Review);
  };

  const handleSubmitted = (responseData, submitData) => {
    if (submitData?.status === 'Draft') {
      toast.success('Save draft successfully');
      navigate(ROUTE_PATH.dashboard);
    } else {
      setTransationSubmitted(responseData);
      setStep(STEP.Submitted);
    }
  };

  const handleBackStep = () => {
    setStep(STEP.Create);
  };

  return (
    <FormProvider {...methods}>
      <div className="page-wrapper full-height-dashboard-container">
        {getActiveStep()}
      </div>
    </FormProvider>
  );
};

export default CustomerCreatePage;
