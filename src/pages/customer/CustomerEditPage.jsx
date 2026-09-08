import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner, { useSpinner } from '../../components/common/Spinner.jsx';
import CostomerTransationSubmit from '../../components/customer/create/CustomerTransationSubmit';
import CustomerEdit from '../../components/customer/edit/CustomerEdit';
import CustomerEditReview from '../../components/customer/edit/CustomerEditReview';
import { fetchData } from '../../services/$service';
import { ROUTE_API, ROUTE_PATH } from '../../utils/route-util';

const STEP = {
  Edited: 'Edited',
  Review: 'Review',
  Submitted: 'Submitted',
};

const CustomerEditPage = () => {
  document.title = 'E-CHANNEL PORTAL | customer edit';
  const params = useParams();

  const [product, setProduct] = useState([]);
  const [arrProject, setArrProject] = useState([]);
  const [transactionSubmitted, setTransationSubmitted] = useState({});
  const [step, setStep] = useState(STEP.Create);
  const methods = useForm();
  const navigate = useNavigate();

  // const [module] = useState(
  //   JSON.parse(localStorage.getItem('insurance-product_menu_storage'))
  // );

  const getList = () => {
    fetchData(
      ROUTE_API.operationCustomerProduct + '/' + params.productCode,
      {},
      'GET'
    ).then((res) => {
      switch (res.status) {
        case 200:
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

  const handleSubmitted = (responseData, submitData) => {
    if (submitData.status === 'Draft') {
      // toast.success('Save draft successfully');
      navigate(-1);
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
      <Spinner {...spinnerState} />
      <div className="page-wrapper full-height-dashboard-container">
        {getActiveStep()}
      </div>
    </FormProvider>
  );
};

export default CustomerEditPage;
