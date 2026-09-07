import { ToastContainer } from 'react-toastify';
// import './App.css';

import AxiosInterceptor from './components/AxiosInterceptor.jsx';

// Default
// Error_handle

// Version History

// Report
import { BrowserRouter as Router } from 'react-router-dom';
import AuthContextProvider from './context/AuthContext.jsx';
import AllRoutes from './router/index.tsx';

function App() {
  return (
    <>
      <ToastContainer
        {...{
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        }}
      />
      <Router
        basename={import.meta.env.VITE_BASE_URL}
        future={{ v7_startTransition: true }}
      >
        <AxiosInterceptor>
          <AuthContextProvider>
            <AllRoutes />
          </AuthContextProvider>
        </AxiosInterceptor>
      </Router>
    </>
  );
}

export default App;
