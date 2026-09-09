import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EyeIcon from '../../../../components/Icons/EyeIcon';
import EyeOffIcon from '../../../../components/Icons/EyeOffIcon';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { changePassword, fetchCurrentUserProfile } from '../../interface-adapters';
import { buildChangePasswordDto, validateRequiredFields } from '../../use-cases';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  document.title = 'E-CHANNEL PORTAL | Change Password';
  const [userUrl, setUserUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [userCode, setUserCode] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invalidFeedBack, setInvalidFeedBack] = useState('');
  const [show, setShow] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });
  const toggleEye = (key: keyof typeof show) =>
    setShow((s) => ({ ...s, [key]: !s[key] }));

  const getList = () => {
    fetchCurrentUserProfile().then((res) => {
      switch (res?.status) {
        case 200:
          {
            const profile = res?.data?.userProfile?.[0];
            setUserUrl(profile?.profileImage ?? '');
            setUserName(profile?.displayName ?? '');
            setUserCode(profile?.userCode ?? '');
          }
          break;
        case 400:
          toast.error(res?.data?.message ?? '');
          break;
        case 403:
          toast.error(String(res?.data));
          break;
        default:
          navigate(ROUTE_PATH.notFound);
      }
    });
  };

  const funcButtonHandleClickExecute = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    if (
      validateRequiredFields([
        userName,
        password,
        newPassword,
        confirmPassword,
      ])
    ) {
      changePassword(
        buildChangePasswordDto(password, newPassword, confirmPassword)
      ).then((res) => {
        switch (res?.status) {
          case 200: {
            toast.success(
              res?.data?.message ?? 'Password changed successfully',
              {
                autoClose: 50,
                pauseOnHover: false,
                onClose: () => navigate(ROUTE_PATH.dashboard),
              }
            );
            break;
          }
          case 400:
            toast.error(res?.data?.message ?? '');
            break;
          case 403:
            toast.error(String(res?.data));
            break;
          default:
            navigate(ROUTE_PATH.notFound);
        }
      });
    }
    e.preventDefault();
  };
  const userNameHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
    setInvalidFeedBack('');
  };
  const PasswordHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setInvalidFeedBack('');
  };
  const newPasswordHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPassword(event.target.value);
    setInvalidFeedBack('');
  };
  const ConfirmPasswordHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
    setInvalidFeedBack('');
  };

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.dashboard);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <React.Fragment>
      <div className="container-tight py-4">
        <form
          onSubmit={funcButtonHandleClickExecute}
          className="card card-md"
          action="."
          method="get"
          autoComplete="off"
        >
          <div className="card-body">
            <h2 className="card-title text-center mb-2">Change Password</h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                borderRadius: 50,
              }}
            >
              <img
                src={userUrl}
                alt={userName}
                className="profile-image-details"
              />
            </div>
            <h5 className="text-center text-danger">{invalidFeedBack}</h5>
            <div className="mb-3 mt-2">
              <label className="form-label">User</label>
              <input
                type="text"
                className={
                  userName !== ''
                    ? 'form-control'
                    : 'form-control is-invalid is-invalid-lite'
                }
                placeholder="User"
                onChange={userNameHandleChange}
                value={userName}
                required
                readOnly
              />
            </div>
            <div className="mb-2">
              <label className="form-label required">Password</label>
              <div className="input-group input-group-flat">
                <input
                  id="password"
                  type={show.password ? 'text' : 'password'}
                  className={'form-control'}
                  placeholder="Password"
                  autoComplete="off"
                  onChange={PasswordHandleChange}
                  value={password}
                  required
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={() => toggleEye('password')}
                  aria-label={show.password ? 'Hide password' : 'Show password'}
                  aria-controls="password"
                >
                  {show.password ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label required">New password</label>
              <div className="input-group input-group-flat">
                <input
                  id="newPassword"
                  type={show.newPassword ? 'text' : 'password'}
                  className={'form-control'}
                  placeholder="New password"
                  autoComplete="off"
                  onChange={newPasswordHandleChange}
                  value={newPassword}
                  required
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={() => toggleEye('newPassword')}
                  aria-label={
                    show.newPassword ? 'Hide new password' : 'Show new password'
                  }
                  aria-controls="newPassword"
                >
                  {show.newPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label required">Confirm password</label>
              <div className="input-group input-group-flat">
                <input
                  id="confirmPassword"
                  type={show.confirmPassword ? 'text' : 'password'}
                  className={'form-control'}
                  placeholder="Confirm password"
                  autoComplete="off"
                  onChange={ConfirmPasswordHandleChange}
                  value={confirmPassword}
                  required
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={() => toggleEye('confirmPassword')}
                  aria-label={
                    show.confirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  aria-controls="confirmPassword"
                >
                  {show.confirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>
            <div className="form-footer d-flex justify-content-between gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary mt-2"
                onClick={goBackHandleClick}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary mt-2">
                Change password
              </button>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default ChangePasswordPage;
