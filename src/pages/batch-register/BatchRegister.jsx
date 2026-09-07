import { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { fetchData } from "../../services/$service";
import ComponentSelectedProduct from "../../components/batch_register/ComponentSelectedProduct";
import ComponentExcelUpload from "../../components/batch_register/ComponentExcelUpload";
import ComponentReview from "../../components/batch_register/ComponentReview";
import { toast } from "react-toastify";

const STEP = {
  SELECTE_PRODUCT: "SELECTE_PRODUCT",
  SUBMITTED: "SUBMITTED",
  REVIEW: "REVIEW",
};

const BatchRegister = () => {
  document.title = "E-CHANNEL PORTAL | batch register";
  const navigate = useNavigate();

  const methods = useForm();
  const [step, setStep] = useState(STEP.SELECTE_PRODUCT);
  const [arrProduct, setArrProduct] = useState([]);
  const [arrProject, setArrProject] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [productCode, setProductCode] = useState("");

  const getList = () => {
    fetchData("/operation-customer/product", {}, "GET").then((res) => {
      switch (res.status) {
        case 200:
          setArrProduct(res?.data?.list);
          break;
        case 400:
          toast.error(res?.data?.message);
          break;
        case 403:
          toast.error(res?.data);
          break;
        default:
          navigate("/404");
      }
    });
  };

  const policyList = (value) => {
    fetchData("/operation-customer/product/" + value, {}, "GET").then((res) => {
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
          redirect("/404");
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

  const handleProductClick = (value) => {
    policyList(value);
    setProductCode(value);
    setStep(STEP.SUBMITTED);
  };

  const handleGoBack = () => {
    setStep(STEP.SELECTE_PRODUCT);
  };

  const handleReviewStep = (value) => {
    setStep(STEP.REVIEW);
    setCustomerList(value);
  };

  const handleReviewBackStep = () => {
    setStep(STEP.SUBMITTED);
  };

  return <FormProvider {...methods}>{getActiveStep()}</FormProvider>;
};

export default BatchRegister;
