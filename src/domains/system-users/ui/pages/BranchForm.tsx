import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import type { SelectOption } from '../../../../@type/report';
import PlusIcon from '../../../../components/Icons/PlusIcon';
import SquareCheckIcon from '../../../../components/Icons/SquareCheckIcon';
import WrapperComponent from '../../../../components/WrapperComponent';
import ButtonGroup from '../../../../components/buttons/ButtonGroup';
import CancelButton from '../../../../components/buttons/CancelButton';
import SubmitButton from '../../../../components/buttons/SubmitButton';
import Modal, { useModal } from '../../../../components/common/modal';
import SearchBox from '../../../../components/input/SearchBox';
import PageBodyComponent from '../../../../components/pages/PageBodyComponent';
import PaginationComponent from '../../../../components/paginations/PaginationComponent';
import TableCell from '../../../../components/table/TableCell';
import TableRow from '../../../../components/table/TableRow';
import HeaderTableComponent from '../../../../components/table/table_action/HeaderTableComponent';
import TableRowDeleteComponentHandle from '../../../../components/table/table_action/TableRowDeleteComponentHandle';
import TableRowStatusComponentHandle from '../../../../components/table/table_action/TableRowStatusComponentHandle';
import useMessage from '../../../../hooks/useMessage';
import { ROUTE_API, ROUTE_PATH } from '../../../../utils/route-util';
import type { UserBranchDetail, UserBranchListItem } from '../../entities';
import {
  createUserBranchAccess,
  fetchUserBranch,
  fetchUserBranchCategory,
  setDefaultUserBranchAccess,
} from '../../interface-adapters';
import { buildBranchAccessDto } from '../../use-cases';

const BranchForm = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const { modalRef, openModal, closeModal } = useModal();
  document.title = 'Alt-Fa APIs Admin System | System user-company';
  const { showErrorResponseMessage } = useMessage();
  const [details, setDetail] = useState<UserBranchDetail | null>(null);
  const [list, setList] = useState<UserBranchListItem[] | null>(null);
  const [branchs, setBranch] = useState<SelectOption[] | null>(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [search, setSearch] = useState('');
  const [roleCurrentPage, setRoleCurrentPage] = useState(1);
  const [rolePageNum, setRolePageNum] = useState(1);
  const rolePerPage = 10;
  const roleOffset = (roleCurrentPage - 1) * rolePerPage;
  function roleHandlePageClick({
    selected: selectedPage,
  }: {
    selected: number;
  }) {
    setRoleCurrentPage(selectedPage + 1);
    setRolePageNum(selectedPage + 1);
  }

  const fetchRows = async () => {
    try {
      const response = await fetchUserBranch({
        app: params.get('appMember'),
        company: params.get('companyMember'),
        user: params.get('uuid'),
      });
      const data = response?.data;
      setDetail(data?.detail ?? null);
      setList(data?.list ?? null);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBranchRows = async () => {
    try {
      const response = await fetchUserBranchCategory({
        app: params.get('appMember'),
        company: params.get('companyMember'),
        user: params.get('uuid'),
      });
      const data = response?.data;
      setBranch(data?.company ?? null);
    } catch (error) {
      console.log(error);
    }
  };

  const branchCreateSubmit = async () => {
    try {
      await createUserBranchAccess(
        buildBranchAccessDto(
          params.get('appMember'),
          params.get('companyMember'),
          params.get('uuid'),
          selectedBranch
        )
      );
      toast.success('Success!');
      fetchBranchRows();
      setSelectedBranch(branchs?.[0]?.value ?? '');
      fetchRows();
    } catch (error) {
      showErrorResponseMessage(error);
      console.log(error);
    }
  };

  const branchDefaultSubmit = async (item: UserBranchListItem) => {
    try {
      await setDefaultUserBranchAccess({
        transactionCode: item.uuid,
        applicationFamily: params.get('appMember'),
        companyFamily: params.get('companyMember'),
        userCode: params.get('uuid'),
      });
      toast.success('Success!');
      fetchRows();
    } catch (error) {
      showErrorResponseMessage(error);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);
  return (
    <>
      <Modal ref={modalRef} title={'BRANCH CONFIGURATION'} size="lg">
        <div className="form-group mb-3 ">
          <label className={`form-label required`}>Branch</label>
          <div>
            <Select
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
              placeholder="Select Option"
              value={branchs?.filter(({ value }) => value === selectedBranch)}
              options={branchs ?? []}
              onChange={(e) => setSelectedBranch(e?.value ?? '')}
            />
          </div>
        </div>

        <ButtonGroup>
          <SubmitButton tooltip="Submit" onClick={() => branchCreateSubmit()} />
          <CancelButton tooltip="Cancel" onClick={() => closeModal()} />
        </ButtonGroup>
      </Modal>
      <WrapperComponent>
        <HeaderTableComponent
          title="Access branch"
          refreshOnClick={() => fetchRows()}
          back={() =>
            navigate(
              `${ROUTE_PATH.userCompany}?uuid=${params.get(
                'uuid'
              )}&appMember=${params.get('appMember')}`
            )
          }
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
                  <div className="col-6">
                    <label className="form-group col-md-6">
                      Company Name: {`${details?.companyName}`}
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
                  <div className="col-6">
                    <label className="form-group col-md-6">
                      User Name: {`${details?.userName}`}
                    </label>
                  </div>
                </div>
                <div className="hr-text text-green hr-text-left">
                  Access branch
                </div>
                <div className="row">
                  <div className="col d-flex justify-content-start">
                    <div
                      className="badge bg-azure cursor-pointer center d-flex mb-4"
                      onClick={() => {
                        fetchBranchRows();
                        openModal();
                      }}
                    >
                      <PlusIcon />
                      <div className="py-1 margin-left-right-5">Add Branch</div>
                    </div>
                  </div>
                  <div className="col d-flex justify-content-end">
                    <SearchBox
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => (
                        setSearch(e.target.value), setRoleCurrentPage(1)
                      )}
                    />
                  </div>
                </div>

                <div className="col-auto ms-auto d-print-none"></div>
                <div className="card-table table-responsive">
                  <table className="table table-vcenter table-light">
                    <tbody>
                      {list
                        ?.filter((item) => {
                          return search === ''
                            ? item
                            : (item?.branch
                                ?.toLowerCase()
                                ?.indexOf(search?.toLowerCase()) ?? -1) >= 0;
                        })
                        ?.slice(roleOffset, roleOffset + rolePerPage)
                        ?.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell
                              className="text-muted"
                              value={item.branch}
                            />
                            <td className="td-action-item text-end">
                              <TableRowStatusComponentHandle
                                active={item?.active}
                                success={() => fetchRows()}
                                uuid={item?.uuid}
                                route={ROUTE_API.systemUserRoleBranchStatus}
                              />
                              <span
                                className={`${
                                  !item?.default
                                    ? 'text-danger'
                                    : 'text-primary'
                                } mr-5`}
                              >
                                {!item?.default ? '' : 'Default'}
                              </span>
                              <SquareCheckIcon
                                onClick={() => branchDefaultSubmit(item)}
                              />
                              <TableRowDeleteComponentHandle
                                title="Delete branch"
                                message={`Delete branch?
                                ${item?.branch}`}
                                uuid={item?.uuid}
                                route={ROUTE_API.systemUserRoleBranch}
                                success={() => fetchRows()}
                              />
                            </td>
                          </TableRow>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <PaginationComponent
                totalDocs={list?.length}
                pageNum={rolePageNum}
                perPage={10}
                onPageChange={roleHandlePageClick}
                currentPage={roleCurrentPage}
                label
              />
            </div>
          </div>
        </PageBodyComponent>
      </WrapperComponent>
    </>
  );
};

export default BranchForm;
