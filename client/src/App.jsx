import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import AuthLayout from './layouts/AuthLayout';
import RootLayout from './layouts/RootLayout';
import Login from './pages/auth/Login';
import StudentRegistration from './pages/auth/StudentRegistration';
import CollegeRegistration from './pages/auth/CollegeRegistration';
import CollegeSelection from './pages/auth/CollegeSelection';
import CollegeAdminSelection from './pages/auth/CollegeAdminSelection';
import Home from './pages/public/Home';
import HowItWorksStudents from './pages/public/HowItWorksStudents';
import HowItWorksColleges from './pages/public/HowItWorksColleges';
import CollegeBrowse from './pages/public/CollegeBrowse';
import CollegeView from './pages/public/CollegeView';
import AmbassadorApply from './pages/public/AmbassadorApply';
import BlogList from './pages/public/BlogList';
import BlogPost from './pages/public/BlogPost';
import NotFound from './pages/errors/NotFound';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import StudentDashboard from './pages/student/StudentDashboard';
import Overview from './pages/student/Overview';
import MyColleges from './pages/student/MyColleges';
import Leaderboard from './pages/student/Leaderboard';
import Referrals from './pages/student/Referrals';
import Ambassador from './pages/student/Ambassador';
import StudentSettings from './pages/student/Settings';
import BuildOnCollegen from './pages/student/BuildOnCollegen';
import CollegeAdminDashboard from './pages/collegeAdmin/CollegeAdminDashboard';
import CollegeAdminOverview from './pages/collegeAdmin/Overview';
import CollegeAdminCommunity from './pages/collegeAdmin/Community';
import CollegeAdminCollegeProfile from './pages/collegeAdmin/CollegeProfile';
import CollegeAdminTokenPreferences from './pages/collegeAdmin/TokenPreferences';
import CollegeAdminLeaderboard from './pages/collegeAdmin/Leaderboard';
import CollegeAdminSettings from './pages/collegeAdmin/Settings';
import PlatformAdminDashboard from './pages/platformAdmin/PlatformAdminDashboard';
import PlatformAdminStudents from './pages/platformAdmin/Students';
import PlatformAdminColleges from './pages/platformAdmin/Colleges';
import PlatformAdminCollegeEdit from './pages/platformAdmin/CollegeEdit';
import PlatformAdminAmbassadors from './pages/platformAdmin/Ambassadors';
import PlatformAdminSubscribers from './pages/platformAdmin/Subscribers';
  
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
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="ambassador/apply" element={<AmbassadorApply />} />
        <Route
          path="auth"
          element={<AuthLayout />}
        >
          <Route path="login" element={<Login />} />
          <Route path="register/student" element={<StudentRegistration />} />
          <Route path="register/college" element={<CollegeRegistration />} />
          <Route path="college-selection" element={<CollegeSelection />} />
          <Route path="college-admin-selection" element={<CollegeAdminSelection />} />
        </Route>
      </Route>
      {/* Dashboard routes - no RootLayout (they have their own DashboardLayout) */}
      <Route path="student/dashboard" element={<Overview />} />
      <Route path="student/overview" element={<Overview />} />
      <Route path="student/colleges" element={<MyColleges />} />
      <Route path="student/leaderboard" element={<Leaderboard />} />
      <Route path="student/referrals" element={<Referrals />} />
      <Route path="student/ambassador" element={<Ambassador />} />
      <Route path="student/settings" element={<StudentSettings />} />
      <Route path="student/build-on-collegen" element={<BuildOnCollegen />} />
      <Route path="college-admin/dashboard" element={<CollegeAdminOverview />} />
      <Route path="college-admin/overview" element={<CollegeAdminOverview />} />
      <Route path="college-admin/community" element={<CollegeAdminCommunity />} />
      <Route path="college-admin/college" element={<CollegeAdminCollegeProfile />} />
      <Route path="college-admin/token" element={<CollegeAdminTokenPreferences />} />
      <Route path="college-admin/leaderboard" element={<CollegeAdminLeaderboard />} />
      <Route path="college-admin/settings" element={<CollegeAdminSettings />} />
      <Route path="platform-admin/dashboard" element={<PlatformAdminDashboard />} />
      <Route path="platform-admin/students" element={<PlatformAdminStudents />} />
      <Route path="platform-admin/colleges" element={<PlatformAdminColleges />} />
      <Route path="platform-admin/colleges/:id/edit" element={<PlatformAdminCollegeEdit />} />
      <Route path="platform-admin/ambassadors" element={<PlatformAdminAmbassadors />} />
      <Route path="platform-admin/subscribers" element={<PlatformAdminSubscribers />} />
      <Route path="*" element={<NotFound />} />
    </>
  );

  const router = createBrowserRouter(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ToastProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App