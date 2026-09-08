import { ToastContainer } from 'react-toastify';
// import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AxiosInterceptor from './components/AxiosInterceptor';
import AuthContextProvider from './context/AuthContext';
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
