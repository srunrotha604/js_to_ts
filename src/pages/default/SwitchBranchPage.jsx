import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';

const SwitchBranchPage = () => {
  document.title = 'E-CHANNEL PORTAL | Switch Branch';
  const { company } = useAuth();
  const [selectedCompany, setSelectdCompany] = useState('');
  const [optionBranch, setOptionBranch] = useState([]);
  const [selectedBranch, setSelectdBranch] = useState('');

  const funcButtonHandleClickExecute = (e) => {
    let messages = [];
    if (selectedCompany === '') {
      messages.push(true);
    }
    if (selectedBranch === '') {
      messages.push(true);
    }
    if (messages.length < 1) {
      let alt_fa_storage = localStorage.getItem('e_chanel_storage');
      let token_text = JSON.parse(alt_fa_storage);
      const alt_fa_token = {
        token: token_text.token,
        refreshToken: token_text.refreshToken,
        company: selectedCompany,
        branch: selectedBranch,
      };
      localStorage.removeItem('e_chanel_storage');
      localStorage.setItem('e_chanel_storage', JSON.stringify(alt_fa_token));
      window.location.href = '/';
    }
    e.preventDefault();
  };

  useEffect(() => {
    const alt_fa_storage = localStorage.getItem('e_chanel_storage');
    const token_text = JSON.parse(alt_fa_storage);
    setSelectdCompany(token_text.company);
  }, []);

  const companyHandleChange = (e) => {
    setSelectdCompany(e.value);
    let companyItem = company.find((item) => item.value === e.value);
    setOptionBranch(companyItem.branch);
  };

  const branchHandleChange = (e) => {
    setSelectdBranch(e.value);
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
                value={company.filter(function (option) {
                  return option.value === selectedCompany;
                })}
                onChange={companyHandleChange}
                options={company}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label required">Branch</label>
              <Select
                value={optionBranch.filter(function (option) {
                  return option.value === selectedBranch;
                })}
                onChange={branchHandleChange}
                options={optionBranch}
                required
              />
            </div>
            <div className="form-footer">
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={funcButtonHandleClickExecute}
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
