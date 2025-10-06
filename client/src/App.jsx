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
import StudentRegistration from './pages/auth/StudentRegistration';
import CollegeRegistration from './pages/auth/CollegeRegistration';
import Home from './pages/public/Home';
import HowItWorksStudents from './pages/public/HowItWorksStudents';
import HowItWorksColleges from './pages/public/HowItWorksColleges';
import CollegeBrowse from './pages/public/CollegeBrowse';
import CollegeView from './pages/public/CollegeView';
import AmbassadorApply from './pages/public/AmbassadorApply';
import NotFound from './pages/errors/NotFound';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import StudentDashboard from './pages/student/StudentDashboard';
import BuildOnCollegen from './pages/student/BuildOnCollegen';
import CollegeAdminDashboard from './pages/collegeAdmin/CollegeAdminDashboard';
import PlatformAdminDashboard from './pages/platformAdmin/PlatformAdminDashboard';
  
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
        <Route path="colleges" element={<CollegeBrowse />} />
        <Route path="colleges/:id" element={<CollegeView />} />
        <Route path="ambassador/apply" element={<AmbassadorApply />} />
        <Route
          path="auth"
          element={<AuthLayout />}
        >
          <Route path="login" element={<Login />} />
          <Route path="register/student" element={<StudentRegistration />} />
          <Route path="register/college" element={<CollegeRegistration />} />
        </Route>
        <Route path="student/dashboard" element={<StudentDashboard />} />
        <Route path="student/build-on-collegen" element={<BuildOnCollegen />} />
        <Route path="college-admin/dashboard" element={<CollegeAdminDashboard />} />
        <Route path="platform-admin/dashboard" element={<PlatformAdminDashboard />} />
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
