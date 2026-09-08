import { useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData } from '../../services/$service';
import { ROUTE_PATH } from '../../utils/route-util';

const InsuranceProductPage = () => {
  document.title = 'E-CHANNEL PORTAL | insurance product';
  const navigate = useNavigate();
  const [arrProduct, setArrProduct] = useState([]);

  // const [module] = useState(
  //   JSON.parse(localStorage.getItem('insurance-product_menu_storage'))
  // );

  const getList = () => {
    fetchData('/operation-customer/product', {}, 'GET').then((res) => {
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
          redirect('/404');
      }
    });
  };

  useEffect(() => {
    // if (module?.[1]?.status === 'A')
    getList();
  }, []);

  const productHandleClick = (productCode) => {
    navigate(ROUTE_PATH.customerCreateWithProduct(productCode));
  };
  return (
    <div className="page-wrapper full-height-dashboard-container justify-content-center">
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-12">
              <div className="container-tight py-1">
                <form
                  className="card card-md"
                  action="."
                  method="get"
                  autoComplete="off"
                >
                  <div className="card-header">
                    <h2 className="card-title text-center">
                      Choose Insurance Product
                    </h2>
                  </div>
                  <div className="card-body">
                    <div className="btn-list">
                      {arrProduct?.map((item, index) => (
                        <button
                          type="button"
                          className="btn btn-primary d-sm-inline-block"
                          key={index}
                          onClick={() =>
                            productHandleClick(item.productsequenceCode)
                          }
                        >
                          {item.productCode}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceProductPage;
