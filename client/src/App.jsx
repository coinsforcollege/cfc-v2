import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import RootLayout from './layouts/RootLayout';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import StudentRegistration from './pages/auth/StudentRegistration';
import AdminRegistration from './pages/auth/AdminRegistration';
import Home from './pages/public/Home';
import HowItWorksStudents from './pages/public/HowItWorksStudents';
import HowItWorksColleges from './pages/public/HowItWorksColleges';
import NotFound from './pages/errors/NotFound';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import StudentDashboard from './pages/student/Dashboard';
  
const darkTheme = createTheme({
  palette: {
    mode: "light"
  }
})

const queryClient = new QueryClient();

function App() {

  const routes = createRoutesFromElements(
    <>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="how-it-works/students" element={<HowItWorksStudents />} />
        <Route path="how-it-works/colleges" element={<HowItWorksColleges />} />
        <Route
          path="auth"
          element={<AuthLayout />}
        >
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="register/student" element={<StudentRegistration />} />
          <Route path="register/admin" element={<AdminRegistration />} />
        </Route>
        <Route path="student" element={<StudentDashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  );

  const router = createBrowserRouter(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App
