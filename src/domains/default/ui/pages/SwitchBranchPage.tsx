import { useEffect, useState } from 'react';
import Select from 'react-select';
import type { CompanyBranchOption, SelectOption } from '../../../../@type/report';
import { useAuth } from '../../../../context/AuthContext';
import {
  applyBranchSwitch,
  filterBranchesByCompany,
  validateRequiredFields,
} from '../../use-cases';

const SwitchBranchPage = () => {
  document.title = 'E-CHANNEL PORTAL | Switch Branch';
  const { company } = useAuth() as { company: CompanyBranchOption[] | null };
  const [selectedCompany, setSelectdCompany] = useState('');
  const [optionBranch, setOptionBranch] = useState<SelectOption[]>([]);
  const [selectedBranch, setSelectdBranch] = useState('');

  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([selectedCompany, selectedBranch])) {
      applyBranchSwitch(selectedCompany, selectedBranch);
      window.location.href = '/';
    }
    e.preventDefault();
  };

  useEffect(() => {
    const alt_fa_storage = localStorage.getItem('e_chanel_storage') || '';
    const token_text = JSON.parse(alt_fa_storage);
    setSelectdCompany(token_text.company);
  }, []);

  const companyHandleChange = (option: CompanyBranchOption | null) => {
    setSelectdCompany(option?.value ?? '');
    setOptionBranch(filterBranchesByCompany(company, option?.value ?? ''));
  };

  const branchHandleChange = (option: SelectOption | null) => {
    setSelectdBranch(option?.value ?? '');
  };

  return (
    <>
      <div className="container-tight py-4">
        <form
          className="card card-md"
          action="."
          method="get"
          autoComplete="off"
        >
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Switch branch</h2>
            <div className="mb-3">
              <label className="form-label required">Company</label>
              <Select
                value={company?.filter(function (option) {
                  return option.value === selectedCompany;
                })}
                onChange={(e) => companyHandleChange(e)}
                options={company ?? []}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label required">Branch</label>
              <Select
                value={optionBranch.filter(function (option) {
                  return option.value === selectedBranch;
                })}
                onChange={(e) => branchHandleChange(e)}
                options={optionBranch}
                required
              />
            </div>
            <div className="form-footer">
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  funcButtonHandleClickExecute(e);
                }}
              >
                Switch branch
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SwitchBranchPage;
