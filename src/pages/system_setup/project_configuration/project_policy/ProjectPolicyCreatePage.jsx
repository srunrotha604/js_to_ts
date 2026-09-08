import { useEffect, useState } from 'react';
import { MdClear } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';
import {
  components,
  createFilter,
  WindowedMenuList,
} from 'react-windowed-select';
import { fetchData } from '../../../../services/$service';
import { ROUTE_API, ROUTE_PATH } from '../../../../utils/route-util';

const ProjectPolicyCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | project | policy | create';
  const navigate = useNavigate();
  const params = useParams();

  const [optionPolicy, setOptionPolicy] = useState([]);
  const [arrPolicy, setArrPolicy] = useState([]);
  const [selectedPolicy, setSelectdPolicy] = useState('');

  const [optionProduct, setOptionProduct] = useState([]);
  const [selectedProduct, setSelectdProduct] = useState('');

  const funcButtonHandleClickExecute = (e) => {
    let messages = [];
    if (selectedPolicy === '') {
      messages.push(true);
    }
    if (messages.length < 1) {
      const data = {
        projectFamily: params.key,
        policyCode: selectedPolicy,
      };
      fetchData('/operation-project/policy', data, 'POST').then((res) => {
        switch (res.status) {
          case 200:
            toast.success(res?.data?.message);
            navigate(ROUTE_PATH.projectPolicy(params.key));
            break;
          case 400:
            toast.error(res?.data?.message);
            break;
          case 403:
            toast.error(res?.data);
            break;
          default:
            navigate(ROUTE_PATH.error404);
        }
      });
    }
    e.preventDefault();
  };

  const getPolicyOption = () => {
    fetchData(ROUTE_API.coreSystemOperationPolicy, {}, 'GET').then((res) => {
      switch (res.status) {
        case 200:
          setOptionProduct(res?.data?.product);
          setArrPolicy(res?.data?.policy);
          break;
        case 400:
          toast.error(res?.data?.message);
          break;
        case 403:
          toast.error(res?.data);
          break;
        default:
          navigate(ROUTE_PATH.error404);
      }
    });
  };

  const policyHandleChange = (e) => {
    {
      e != null ? setSelectdPolicy(e.value) : setSelectdPolicy('');
    }
  };

  const productHandleChange = (e) => {
    if (e !== null) {
      setSelectdProduct(e.value);
      const policyList = arrPolicy?.filter((item) => {
        return item.keyCode === e.value.toString();
      });
      setOptionPolicy(policyList);
    } else {
      setSelectdProduct('');
    }
  };

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.projectPolicy(params.key));
  };

  useEffect(() => {
    getPolicyOption();
  }, []);

  const customFilter = createFilter({ ignoreAccents: false });
  const customComponents = {
    MenuList: WindowedMenuList,
    ClearIndicator: (props) => (
      <components.ClearIndicator {...props}>
        <MdClear />
      </components.ClearIndicator>
    ),
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Add policy</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <button
                    className="btn btn-primary d-none d-sm-inline-block"
                    onClick={goBackHandleClick}
                  >
                    <svg
                      className="icon"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
                    </svg>
                    Back
                  </button>
                  <button
                    className="btn btn-primary d-sm-none btn-icon"
                    onClick={goBackHandleClick}
                  >
                    <svg
                      className="icon"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              <div className="card-body">
                <div className="col-md-12">
                  <div className="form-group mb-3">
                    <label className="form-label required">Product</label>
                    <div>
                      <ReactSelect
                        components={customComponents}
                        filterOption={customFilter}
                        options={optionProduct}
                        isClearable={true}
                        value={optionProduct?.filter(function (option) {
                          return option?.value === selectedProduct;
                        })}
                        onChange={productHandleChange}
                        required
                      />
                      <div className="invalid-feedback">
                        Please select Product!
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Policy</label>
                    <div>
                      <ReactSelect
                        components={customComponents}
                        filterOption={customFilter}
                        options={optionPolicy}
                        isClearable={true}
                        value={optionPolicy?.filter(function (option) {
                          return option?.value === selectedPolicy;
                        })}
                        onChange={policyHandleChange}
                        required
                      />
                      <div className="invalid-feedback">
                        Please select Policy!
                      </div>
                    </div>
                  </div>
                  <div className="form-footer">
                    <button
                      className="btn btn-primary"
                      onClick={funcButtonHandleClickExecute}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-check"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectPolicyCreatePage;
