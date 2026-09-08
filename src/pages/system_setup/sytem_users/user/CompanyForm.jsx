import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListDetailsIcon from '../../../../components/Icons/ListDetailsIcon';
import PageBodyComponent from '../../../../components/pages/PageBodyComponent';
import HeaderTableComponent from '../../../../components/table/table_action/HeaderTableComponent';
import TableRowStatusComponentHandle from '../../../../components/table/table_action/TableRowStatusComponentHandle';
import TableCell from '../../../../components/table/TableCell';
import TableRow from '../../../../components/table/TableRow';
import WrapperComponent from '../../../../components/WrapperComponent';
import { fetchDataAsync } from '../../../../services/$service';
import { ROUTE_API, ROUTE_PATH } from '../../../../utils/route-util';

const CompanyForm = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  document.title = 'Alt-Fa APIs Admin System | System user-company';

  const [details, setDetail] = useState(null);
  const [list, setList] = useState(null);

  const fetchRows = async () => {
    try {
      const response = await fetchDataAsync(ROUTE_API.eChanelUserCompany, {
        params: {
          application_code: params.get('appMember'),
          user_code: params.get('uuid'),
        },
      });
      const data = response?.data;
      setDetail(data?.detail);
      setList(data?.list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);
  return (
    <>
      <WrapperComponent>
        <HeaderTableComponent
          title="Access company"
          refreshOnClick={() => fetchRows()}
          back={() => navigate(ROUTE_PATH.user)}
          refresh
        />
        <PageBodyComponent>
          <div className="col-md-12 col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <label className="form-group col-md-6">
                      App Name: {`${details?.appName}`}
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className="form-group col-md-6">
                      Display Name:
                      {`${details?.givenName} ${details?.surName}`}
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label className="form-group col-md-6">
                      User Name: {`${details?.userName}`}
                    </label>
                  </div>
                </div>
                <div className="hr-text text-green hr-text-left">
                  Access company
                </div>
                <div className="card-table table-responsive">
                  <table className="table table-vcenter table-light">
                    <tbody>
                      {list?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell
                            className="text-muted"
                            value={item.company}
                          />
                          <td className="td-action-item text-end">
                            <TableRowStatusComponentHandle
                              active={item?.active}
                              success={() => fetchRows()}
                              uuid={item?.uuid}
                              route={ROUTE_API.systemUserRoleCompanyStatus}
                            />
                            <span
                              className={`${
                                !item?.default ? 'text-danger' : 'text-primary'
                              } mr-5`}
                            >
                              {!item?.default ? '' : 'Default'}
                            </span>

                            <ListDetailsIcon
                              stroke="#00abfb"
                              onClick={() => {
                                navigate(
                                  `${
                                    ROUTE_PATH.userCompanyBranch
                                  }?uuid=${params.get(
                                    'uuid'
                                  )}&appMember=${params.get(
                                    'appMember'
                                  )}&companyMember=${item?.companyMember}`
                                );
                              }}
                            />
                          </td>
                        </TableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </PageBodyComponent>
      </WrapperComponent>
    </>
  );
};
export default CompanyForm;
