import { useDebounceFn, useRequest } from 'ahooks';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Loading from '../../../../components/Loading';
import SearchBox from '../../../../components/input/SearchBox';
import PaginationComponent from '../../../../components/paginations/PaginationComponent';
import type { LogData } from '../../entities';
import { getLoginLogs } from '../../interface-adapters';
import { buildFilterLogdDto } from '../../use-cases';

const PAGE_SIZE = 10;

const LoginListPage = () => {
  document.title = 'E-CHANNEL PORTAL | login logs';

  const [search, setSearch] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [data, setData] = useState<LogData[]>([]);

  const { loading, run: getList } = useRequest(
    (params: { pageNumber: number; searchValue: string }) =>
      getLoginLogs(
        buildFilterLogdDto(params.pageNumber, PAGE_SIZE, '', params.searchValue)
      ),
    {
      defaultParams: [{ pageNumber: 1, searchValue: '' }],
      onSuccess: (response) => {
        setData(response?.data?.datas ?? []);
        setTotalDocs(response?.data?.total ?? 0);
      },
    }
  );

  const { run: debouncedSearch } = useDebounceFn(
    (value: string) => getList({ pageNumber: 1, searchValue: value }),
    { wait: 400 }
  );

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setPageNum(1);
    debouncedSearch(value);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    const nextPage = selected + 1;
    setPageNum(nextPage);
    getList({ pageNumber: nextPage, searchValue: search });
  };

  return (
    <>
      {loading && <Loading value={loading} />}
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Login Logs</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="container-xl">
            <div className="row align-items-center mb-2">
              <SearchBox onChange={onSearchChange} />
            </div>

            <div className="row row-cards">
              <div className="col-12">
                <div className="card">
                  <div className="table-responsive">
                    <table className="table table-vcenter card-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>USER NAME</th>
                          <th>ENVIRONMENT</th>
                          <th>LOGIN TIME</th>
                          <th>LOGOUT TIME</th>
                          <th>STATUS</th>
                          <th>FAILURE REASON</th>
                          <th>IP ADDRESS</th>
                          <th>DEVICE</th>
                          <th>BROWSER</th>
                          <th>OS</th>
                          <th>LOGOUT REASON</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && data.length === 0 ? (
                          <tr>
                            <td colSpan={12} className="text-center">
                              No result found
                            </td>
                          </tr>
                        ) : null}
                        {data.map((item, index) => (
                          <tr key={index}>
                            <td className="text-muted">
                              {(pageNum - 1) * PAGE_SIZE + index + 1}
                            </td>
                            <td className="text-muted">{item.userName}</td>
                            <td className="text-muted">{item.environment}</td>
                            <td className="text-muted">{item.loginTime}</td>
                            <td className="text-muted">{item.logoutTime}</td>
                            <td
                              className={
                                item.loginStatus?.toLowerCase().includes('fail')
                                  ? 'text-danger'
                                  : 'text-primary'
                              }
                            >
                              {item.loginStatus}
                            </td>
                            <td className="text-muted">{item.failureReason}</td>
                            <td className="text-muted">{item.ipAddress}</td>
                            <td className="text-muted">{item.deviceType}</td>
                            <td className="text-muted">{item.browser}</td>
                            <td className="text-muted">
                              {item.operatingSystem}
                            </td>
                            <td className="text-muted">{item.logoutReason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationComponent
                    totalDocs={totalDocs}
                    pageNum={pageNum}
                    perPage={PAGE_SIZE}
                    onPageChange={handlePageChange}
                    currentPage={pageNum}
                    label
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginListPage;
