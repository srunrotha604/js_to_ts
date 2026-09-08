import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { redirect, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ComponentExcelUpload from '../../components/batch_register/ComponentExcelUpload';
import ComponentReview from '../../components/batch_register/ComponentReview';
import ComponentSelectedProduct from '../../components/batch_register/ComponentSelectedProduct';
import type {
  CustomerTransaction,
  ProductListResponse,
  ProductOption,
  ProjectCategoryResponse,
  ProjectPolicyOption,
} from '../../@type/batch';
import { fetchData } from '../../services/$service';
import { ROUTE_API, ROUTE_PATH } from '../../utils/route-util';

const STEP = {
  SELECTE_PRODUCT: 'SELECTE_PRODUCT',
  SUBMITTED: 'SUBMITTED',
  REVIEW: 'REVIEW',
};

const BatchRegister = () => {
  document.title = 'E-CHANNEL PORTAL | batch register';
  const navigate = useNavigate();

  const methods = useForm();
  const [step, setStep] = useState(STEP.SELECTE_PRODUCT);
  const [arrProduct, setArrProduct] = useState<ProductOption[]>([]);
  const [arrProject, setArrProject] = useState<ProjectPolicyOption[]>([]);
  const [customerList, setCustomerList] = useState<CustomerTransaction[]>([]);
  const [productCode, setProductCode] = useState('');

  const getList = () => {
    fetchData<ProductListResponse>(
      ROUTE_API.operationCustomerProduct,
      {},
      'GET'
    ).then((res) => {
      switch (res?.status) {
        case 200:
          setArrProduct(res?.data?.list ?? []);
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

  const policyList = (value: string) => {
    fetchData<ProjectCategoryResponse>(
      ROUTE_API.operationCustomerProduct + '/' + value,
      {},
      'GET'
    ).then((res) => {
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
          redirect('/404');
      }
    });
  };

  useEffect(() => {
    getList();
  }, []);

  const getActiveStep = () => {
    switch (step) {
      case STEP.SELECTE_PRODUCT:
        return (
          <ComponentSelectedProduct
            product={arrProduct}
            handleProductClick={handleProductClick}
          />
        );
      case STEP.SUBMITTED:
        return (
          <ComponentExcelUpload
            product={productCode}
            handleGoBack={handleGoBack}
            project={arrProject}
            handleReviewStep={handleReviewStep}
          />
        );
      case STEP.REVIEW:
        return (
          <ComponentReview
            customerList={customerList}
            product={productCode}
            handleReviewBackStep={handleReviewBackStep}
          />
        );
      default:
        return (
          <ComponentSelectedProduct
            product={arrProduct}
            handleProductClick={handleProductClick}
          />
        );
    }
  };

  const handleProductClick = (value: string) => {
    policyList(value);
    setProductCode(value);
    setStep(STEP.SUBMITTED);
  };

  const handleGoBack = () => {
    setStep(STEP.SELECTE_PRODUCT);
  };

  const handleReviewStep = (value: CustomerTransaction[]) => {
    setStep(STEP.REVIEW);
    setCustomerList(value);
  };

  const handleReviewBackStep = () => {
    setStep(STEP.SUBMITTED);
  };

  return <FormProvider {...methods}>{getActiveStep()}</FormProvider>;
};

export default BatchRegister;
