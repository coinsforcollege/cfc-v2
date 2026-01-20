import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { useEffect } from 'react';
import { initFacebookPixel, trackPageView } from './utils/fbPixel';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { TourProvider } from './contexts/TourContext';
import AuthLayout from './layouts/AuthLayout';
import RootLayout from './layouts/RootLayout';
import ProtectedRoute from './components/guards/ProtectedRoute';
import PublicRoute from './components/guards/PublicRoute';
import Login from './pages/auth/Login';
import UserRegistration from './pages/auth/UserRegistration';
import CollegeRegistration from './pages/auth/CollegeRegistration';
import CollegeSelection from './pages/auth/CollegeSelection';
import CollegeAdminSelection from './pages/auth/CollegeAdminSelection';
import ForgotPassword from './pages/auth/ForgotPassword';
import Home from './pages/public/Home';
import HowItWorksUsers from './pages/public/HowItWorksUsers';
import HowItWorksColleges from './pages/public/HowItWorksColleges';
import ThingsToKnow from './pages/public/ThingsToKnow';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import CollegeBrowse from './pages/public/CollegeBrowse';
import CollegeView from './pages/public/CollegeView';
import NetworkMap from './pages/public/NetworkMap';
import AmbassadorApply from './pages/public/AmbassadorApply';
import BlogList from './pages/public/BlogList';
import BlogPost from './pages/public/BlogPost';
import Contact from './pages/Contact';
import CollegeCoins from './pages/public/CollegeCoins';
import DocsHome from './pages/public/DocsHome';
import DocsCategory from './pages/public/DocsCategory';
import DocsArticle from './pages/public/DocsArticle';
import DocsSearch from './pages/public/DocsSearch';
import DocsFeatured from './pages/public/DocsFeatured';
import NotFound from './pages/errors/NotFound';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import UserDashboard from './pages/user/UserDashboard';
import Overview from './pages/user/Overview';
import MyColleges from './pages/user/MyColleges';
import Leaderboard from './pages/user/Leaderboard';
import Community from './pages/user/Community';
import Ambassador from './pages/user/Ambassador';
import UserSettings from './pages/user/Settings';
import BuildOnCollegen from './pages/user/BuildOnCollegen';
import CollegeAdminDashboard from './pages/collegeAdmin/CollegeAdminDashboard';
import CollegeAdminOverview from './pages/collegeAdmin/Overview';
import CollegeAdminCommunity from './pages/collegeAdmin/Community';
import CollegeAdminCollegeProfile from './pages/collegeAdmin/CollegeProfile';
import CollegeAdminTokenPreferences from './pages/collegeAdmin/TokenPreferences';
import CollegeAdminLeaderboard from './pages/collegeAdmin/Leaderboard';
import CollegeAdminSettings from './pages/collegeAdmin/Settings';
import PlatformAdminDashboard from './pages/platformAdmin/PlatformAdminDashboard';
import PlatformAdminUsers from './pages/platformAdmin/Users';
import PlatformAdminUserView from './pages/platformAdmin/UserView';
import PlatformAdminCollegeAdminView from './pages/platformAdmin/CollegeAdminView';
import PlatformAdminColleges from './pages/platformAdmin/Colleges';
import PlatformAdminCollegeView from './pages/platformAdmin/CollegeView';
import PlatformAdminCollegeAdmins from './pages/platformAdmin/CollegeAdmins';
import PlatformAdminCollegeCreate from './pages/platformAdmin/CollegeCreate';
import PlatformAdminCollegeEdit from './pages/platformAdmin/CollegeEdit';
import PlatformAdminAmbassadors from './pages/platformAdmin/Ambassadors';
import PlatformAdminSubscribers from './pages/platformAdmin/Subscribers';
import BulkImportUpload from './pages/platformAdmin/BulkImportUpload';
import BulkImportPreview from './pages/platformAdmin/BulkImportPreview';
import BulkImportResults from './pages/platformAdmin/BulkImportResults';
import TasksLayout from './pages/platformAdmin/tasks/TasksLayout';
import TaskList from './pages/platformAdmin/tasks/TaskList';
import TaskCreate from './pages/platformAdmin/tasks/TaskCreate';
import CategoryManager from './pages/platformAdmin/tasks/CategoryManager';
import TaskView from './pages/platformAdmin/tasks/TaskView';
  
const darkTheme = createTheme({
  palette: {
    mode: "light"
  }
})

const queryClient = new QueryClient();

function App() {
  // Initialize Facebook Pixel
  useEffect(() => {
    initFacebookPixel();
    trackPageView(); // Track initial page view
  }, []);

  const routes = createRoutesFromElements(
    <>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="how-it-works/users" element={<HowItWorksUsers />} />
        <Route path="how-it-works/colleges" element={<HowItWorksColleges />} />
        <Route path="things-to-know" element={<ThingsToKnow />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="colleges" element={<CollegeBrowse />} />
        <Route path="colleges/:id" element={<CollegeView />} />
        <Route path="network" element={<NetworkMap />} />
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="college-coins" element={<CollegeCoins />} />
        <Route path="docs" element={<DocsHome />} />
        <Route path="docs/search" element={<DocsSearch />} />
        <Route path="docs/featured" element={<DocsFeatured />} />
        <Route path="docs/:categorySlug" element={<DocsCategory />} />
        <Route path="docs/:categorySlug/:articleSlug" element={<DocsArticle />} />
        <Route path="contact" element={<Contact />} />
        <Route path="ambassador/apply" element={<AmbassadorApply />} />
        <Route
          path="auth"
          element={<AuthLayout />}
        >
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="register/user" element={<PublicRoute><UserRegistration /></PublicRoute>} />
          <Route path="register/college" element={<PublicRoute><CollegeRegistration /></PublicRoute>} />
          <Route path="college-selection" element={<ProtectedRoute allowedRoles={['user']}><CollegeSelection /></ProtectedRoute>} />
          <Route path="college-admin-selection" element={<ProtectedRoute allowedRoles={['college_admin']}><CollegeAdminSelection /></ProtectedRoute>} />
        </Route>
      </Route>
      {/* Dashboard routes - no RootLayout (they have their own DashboardLayout) */}
      <Route path="user/dashboard" element={<ProtectedRoute allowedRoles={['user']}><Overview /></ProtectedRoute>} />
      <Route path="user/overview" element={<ProtectedRoute allowedRoles={['user']}><Overview /></ProtectedRoute>} />
      <Route path="user/colleges" element={<ProtectedRoute allowedRoles={['user']}><MyColleges /></ProtectedRoute>} />
      <Route path="user/leaderboard" element={<ProtectedRoute allowedRoles={['user']}><Leaderboard /></ProtectedRoute>} />
      <Route path="user/community" element={<ProtectedRoute allowedRoles={['user']}><Community /></ProtectedRoute>} />
      <Route path="user/referrals" element={<ProtectedRoute allowedRoles={['user']}><Community /></ProtectedRoute>} />
      <Route path="user/ambassador" element={<ProtectedRoute allowedRoles={['user']}><Ambassador /></ProtectedRoute>} />
      <Route path="user/settings" element={<ProtectedRoute allowedRoles={['user']}><UserSettings /></ProtectedRoute>} />
      <Route path="user/build-on-collegen" element={<BuildOnCollegen />} />
      <Route path="college-admin/dashboard" element={<ProtectedRoute allowedRoles={['college_admin']}><CollegeAdminOverview /></ProtectedRoute>} />
      <Route path="college-admin/overview" element={<ProtectedRoute allowedRoles={['college_admin']}><CollegeAdminOverview /></ProtectedRoute>} />
      <Route path="college-admin/community" element={<ProtectedRoute allowedRoles={['college_admin']}><CollegeAdminCommunity /></ProtectedRoute>} />
      <Route path="college-admin/college" element={<ProtectedRoute allowedRoles={['college_admin']}><CollegeAdminCollegeProfile /></ProtectedRoute>} />
      <Route path="college-admin/token" element={<ProtectedRoute allowedRoles={['college_admin']}><CollegeAdminTokenPreferences /></ProtectedRoute>} />
      <Route path="college-admin/leaderboard" element={<ProtectedRoute allowedRoles={['college_admin']}><CollegeAdminLeaderboard /></ProtectedRoute>} />
      <Route path="college-admin/settings" element={<ProtectedRoute allowedRoles={['college_admin']}><CollegeAdminSettings /></ProtectedRoute>} />
      <Route path="platform-admin/dashboard" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminDashboard /></ProtectedRoute>} />
      <Route path="platform-admin/users" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminUsers /></ProtectedRoute>} />
      <Route path="platform-admin/users/:id" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminUserView /></ProtectedRoute>} />
      <Route path="platform-admin/college-admins" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminCollegeAdmins /></ProtectedRoute>} />
      <Route path="platform-admin/college-admins/:id" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminCollegeAdminView /></ProtectedRoute>} />
      <Route path="platform-admin/colleges" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminColleges /></ProtectedRoute>} />
      <Route path="platform-admin/colleges/:id" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminCollegeView /></ProtectedRoute>} />
      <Route path="platform-admin/colleges/create" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminCollegeCreate /></ProtectedRoute>} />
      <Route path="platform-admin/colleges/bulk-import-upload" element={<ProtectedRoute allowedRoles={['platform_admin']}><BulkImportUpload /></ProtectedRoute>} />
      <Route path="platform-admin/colleges/bulk-import-preview" element={<ProtectedRoute allowedRoles={['platform_admin']}><BulkImportPreview /></ProtectedRoute>} />
      <Route path="platform-admin/colleges/bulk-import-results" element={<ProtectedRoute allowedRoles={['platform_admin']}><BulkImportResults /></ProtectedRoute>} />
      <Route path="platform-admin/tasks" element={<ProtectedRoute allowedRoles={['platform_admin']}><TasksLayout /></ProtectedRoute>}>
          <Route index element={<TaskList />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="create" element={<TaskCreate />} />
          <Route path="edit/:id" element={<TaskCreate />} />
          <Route path=":id" element={<TaskView />} />
      </Route>
      <Route path="platform-admin/colleges/:id/edit" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminCollegeEdit /></ProtectedRoute>} />
      <Route path="platform-admin/colleges/:id/edit" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminCollegeEdit /></ProtectedRoute>} />
      <Route path="platform-admin/ambassadors" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminAmbassadors /></ProtectedRoute>} />
      <Route path="platform-admin/subscribers" element={<ProtectedRoute allowedRoles={['platform_admin']}><PlatformAdminSubscribers /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </>
  );

  const router = createBrowserRouter(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
          <ToastProvider>
            <AuthProvider>
              <TourProvider>
                <NotificationProvider>
                  <RouterProvider router={router} />
                  <ReactQueryDevtools initialIsOpen={false} />
                </NotificationProvider>
              </TourProvider>
            </AuthProvider>
          </ToastProvider>
        </GoogleReCaptchaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App