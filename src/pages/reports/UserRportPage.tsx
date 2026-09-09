import clsx from 'clsx';
import fileDownload from 'js-file-download';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import type {
  CompanyBranchOption,
  SelectOption,
  UserReportItem,
  UserReportListResponse,
} from '../../@type/report';
import Button from '../../components/common/Button';
import { selectCustomStyles } from '../../components/common/reactSelectStyles';
import DateRangeSelector from '../../components/form/DateRangeSelector';
import { useAuth } from '../../context/AuthContext';
import ComponentStatus from '../../domains/customer/ui/components/ComponentStatus';
import useLoading from '../../hooks/useLoading';
import useMessage from '../../hooks/useMessage';
import { fetchDataAsync } from '../../services/$service';
import { formatDay } from '../../utils/format-day';
import { ROUTE_API } from '../../utils/route-util';
import { RECORDSTATUS } from '../../utils/status';

const UserReportPage = () => {
  document.title = 'Report | User report';

  const { hasPermissionAccessTransaction, company } = useAuth() as {
    hasPermissionAccessTransaction: (execution: string) => boolean;
    company: CompanyBranchOption[] | null;
  };
  const [data, setData] = useState<UserReportItem[] | null>(null);
  const [loading, startLoading, stopLoading] = useLoading();

  const [status, setStatus] = useState<SelectOption[]>([]);
  const [rowPerPage, setRowPerPage] = useState(25);
  const [pageNum, setPageNum] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [branch, setBranch] = useState<SelectOption[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<SelectOption[]>([]);
  const [date, setDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const onDateChange = (newDate: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    setDate(newDate);
  };

  useEffect(() => {
    if (company) {
      const e_chanel_storage = localStorage.getItem('e_chanel_storage');
      const token_text = e_chanel_storage ? JSON.parse(e_chanel_storage) : null;
      const companyDetails = company?.find(
        (item) => item?.value === token_text?.company
      );
      const tempBranch = companyDetails?.branch || [];

      setBranch(tempBranch);
    }
  }, []);

  useEffect(() => {}, [hasPermissionAccessTransaction]);

  const statusOptions = useMemo(
    () => [
      {
        label: RECORDSTATUS.Active,
        value: RECORDSTATUS.Active,
        hidden: !hasPermissionAccessTransaction('submitted'),
      },
      {
        label: RECORDSTATUS.Disable,
        value: RECORDSTATUS.Disable,
        hidden: !hasPermissionAccessTransaction('approved'),
      },
    ],
    [hasPermissionAccessTransaction]
  );

  const getList = async ({
    pageNumber,
    pageSize,
  }: {
    pageNumber: number;
    pageSize: number;
  }) => {
    try {
      startLoading();
      const response = await fetchDataAsync<UserReportListResponse>(
        ROUTE_API.exportOperationUser,
        {
          params: {
            status: status?.map((item) => item.value).join(',') || '',
            pageSize,
            pageNumber,
            branchName:
              selectedBranch?.map((item) => item.value).join(',') || '',
            startDate: date?.startDate
              ? formatDay(date?.startDate, 'YYYYMMDD')
              : null,
            endDate: date?.endDate
              ? formatDay(date?.endDate, 'YYYYMMDD')
              : null,
            type: 'filter',
          },
        }
      );
      setTotalDocs(response?.data?.totalDocs ?? 0);
      setData(response?.data?.list ?? []);
      setIsFieldDirty(false);
      resetTableScroll();
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  const [exportLoading, startExportLoading, stopExportLoading] = useLoading();
  const { showErrorResponseMessage } = useMessage();

  const exportList = async () => {
    try {
      startExportLoading();
      const response = await fetchDataAsync<Blob>(
        ROUTE_API.exportOperationUser,
        {
          params: {
            status: status?.map((item) => item.value).join(',') || '',
            branchName:
              selectedBranch?.map((item) => item.value).join(',') || '',
            startDate: date?.startDate
              ? formatDay(date?.startDate, 'YYYYMMDD')
              : null,
            endDate: date?.endDate
              ? formatDay(date?.endDate, 'YYYYMMDD')
              : null,
            type: 'export',
          },
          responseType: 'blob',
        }
      );
      if (!response?.data) return;
      fileDownload(
        response.data,
        `user_export ${formatDay(new Date(), 'DD-MM-YY')}.xlsx`
      );
    } catch (error) {
      console.log(error);
      showErrorResponseMessage(error);
    } finally {
      stopExportLoading();
    }
  };

  const tableRef = useRef<HTMLDivElement | null>(null);

  const resetTableScroll = (position = 0) => {
    if (tableRef.current) {
      tableRef.current.scrollTop = position;
    }
  };

  const isFilterAble = date?.startDate && date?.endDate;
  const [isFieldDirty, setIsFieldDirty] = useState(false);

  useEffect(() => {
    if (data !== null && isFieldDirty === false) {
      setIsFieldDirty(true);
    }
  }, [status, rowPerPage, pageNum, selectedBranch]);

  return (
    <div
      className="container-xl full-height-dashboard-container"
      style={{ height: '0', overflow: 'auto', display: 'flex' }}
    >
      <div className="page-body mb-0 flex-1 d-flex">
        <div className="card overflow-hidden d-flex flex-1">
          <div className="card-body pb-0" style={{ flex: 0 }}>
            <h2 className="mb-3">User Report</h2>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-6">
                    <div>
                      <label className="form-label">
                        <b>Date:</b>
                      </label>
                      <DateRangeSelector
                        date={date}
                        placeholder={'Select Date'}
                        onDateChange={onDateChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <b>Status:</b>
                      </label>
                      <Select
                        menuPortalTarget={document.body}
                        value={status}
                        onChange={(value) => setStatus([...value])}
                        filterOption={(option) => !option.data.hidden}
                        closeMenuOnSelect={false}
                        isMulti
                        isClearable
                        options={statusOptions}
                        styles={customSelectStyle}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-2">
                    <div>
                      <label className="form-label">
                        <b>Branch:</b>
                      </label>
                      <Select
                        value={selectedBranch}
                        onChange={(value) => setSelectedBranch([...value])}
                        closeMenuOnSelect={false}
                        isMulti
                        options={branch}
                        styles={customSelectStyle}
                      />
                    </div>
                  </div>
                  <div className="btn-list mb-2 col-md-12">
                    <Button
                      loading={loading}
                      style={{ width: '100px' }}
                      disabled={!isFilterAble}
                      onClick={() =>
                        getList({ pageNumber: 1, pageSize: rowPerPage })
                      }
                    >
                      Filter{' '}
                      {isFieldDirty && (
                        <span className="badge bg-white d-block ml-5" />
                      )}
                    </Button>
                    <div className="ms-auto" />
                    <Button
                      loading={exportLoading}
                      loadingText={'Exporting...'}
                      style={{ width: '100px' }}
                      onClick={exportList}
                      variant="primary"
                    >
                      Export
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-12"></div>
            </div>
          </div>
          <div
            ref={tableRef}
            className="table-responsive"
            style={{ flexGrow: 1 }}
          >
            <table className="table table-vcenter card-table">
              <thead className="position-sticky top-0 ">
                <tr>
                  <th>No.</th>
                  <th>USER NAME</th>
                  <th>EAMAIL</th>
                  <th>ROLE</th>
                  <th>BRANCH</th>
                  <th>DATE REGISTERED</th>
                  <th>CREATED BY</th>
                  <th style={{ width: '10%' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {!loading && data?.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center">
                      No result found
                    </td>
                  </tr>
                ) : null}
                {data?.map((item, index) => (
                  <tr
                    style={{
                      background: item.deleted ? 'rgb(247 219 219 / 45%)' : '',
                    }}
                    key={index}
                  >
                    <td className="text-muted">{index + 1}</td>
                    <td className="text-muted">{item.userName}</td>
                    <td className="text-muted">{item.email}</td>
                    <td className="text-muted">{item.role}</td>
                    <td className="text-muted">{item.branch}</td>
                    <td className="text-muted">{item.dateRegisterd}</td>
                    <td className="text-muted">{item.createedBy}</td>
                    <td className={clsx('text-bold')}>
                      <ComponentStatus status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="py-2 border-top border-bottom d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center mx-2">
              <label className="mx-2">Row per page :</label>
              <select
                value={rowPerPage}
                onChange={(e) => {
                  setRowPerPage(Number(e.target.value));
                  getList({ pageNumber: 1, pageSize: Number(e.target.value) });
                }}
                className="form-select w-auto"
                aria-label="multiple select example"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="mx-4">
              {totalDocs > 0 && (
                <span className="text-muted">
                  {(Number(pageNum) - 1) * rowPerPage + 1} -{' '}
                  {Number(pageNum) * rowPerPage > totalDocs
                    ? totalDocs
                    : Number(pageNum) * rowPerPage}{' '}
                  of {totalDocs}
                </span>
              )}
            </div>
            <div className="mx-2">
              {totalDocs > 0 && (
                <ReactPaginate
                  forcePage={pageNum - 1 ? pageNum - 1 : 0}
                  previousLabel={
                    <div className="mx-1">
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
                        <polyline points="15 6 9 12 15 18" />
                      </svg>
                    </div>
                  }
                  nextLabel={
                    <div className="mx-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </div>
                  }
                  pageCount={Math.ceil(totalDocs / rowPerPage)}
                  marginPagesDisplayed={3}
                  pageRangeDisplayed={3}
                  onPageChange={(e) => {
                    const tempPageNum = Number(e.selected) + 1;
                    setPageNum(tempPageNum);
                    getList({ pageNumber: tempPageNum, pageSize: rowPerPage });
                  }}
                  containerClassName={'pagination m-0 ml-auto'}
                  pageClassName={'page-item'}
                  pageLinkClassName={'page-link'}
                  previousClassName={'page-item'}
                  previousLinkClassName={'page-link'}
                  nextClassName={'page-item'}
                  nextLinkClassName={'page-link'}
                  breakClassName={'page-item'}
                  breakLinkClassName={'page-link'}
                  activeClassName={'active'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const customSelectStyle = {
  ...selectCustomStyles,
};

export default UserReportPage;
