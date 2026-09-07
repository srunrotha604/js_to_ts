import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData } from '../../../../services/$service';
import Select from 'react-select';
import { ROUTE_PATH } from '../../../../utils/route-util';

const ProductCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | product | create';
  const navigate = useNavigate();

  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const getList = () => {
    fetchData('/operation-product/product', {}, 'GET').then((res) => {
      switch (res.status) {
        case 200:
          setProductList(res?.data?.options);
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
  const funcButtonHandleClickExecute = (e) => {
    let messages = [];
    if (selectedProduct === '') {
      messages.push(true);
    }
    if (productCode === '') {
      messages.push(true);
    }
    if (productName === '') {
      messages.push(true);
    }
    if (messages.length < 1) {
      let data = {
        productsequenceCode: selectedProduct,
        productCode: productCode,
        productName: productName,
      };

      fetchData('/operation-product', data, 'POST').then((res) => {
        switch (res.status) {
          case 200:
            toast.success(res.data.message);
            navigate(ROUTE_PATH.product);
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

  const roleHandleChange = (e) => {
    setSelectedProduct(e.value);
  };

  const productCodeHandleChange = (event) => {
    setProductCode(event.target.value);
  };
  const productNameHandleChange = (event) => {
    setProductName(event.target.value);
  };
  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.product);
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Product create</h2>
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
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label required">Product code</label>
                    <div>
                      <Select
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                        value={productList.find(function (option) {
                          return option.value === selectedProduct;
                        })}
                        onChange={roleHandleChange}
                        options={productList}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Product Label</label>
                    <div>
                      <input
                        type="text"
                        className={
                          productCode !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Product label"
                        onChange={productCodeHandleChange}
                        value={productCode}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Product name</label>
                    <div>
                      <input
                        type="text"
                        className={
                          productName !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Product name"
                        onChange={productNameHandleChange}
                        value={productName}
                        required
                      />
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
    </React.Fragment>
  );
};

export default ProductCreatePage;
