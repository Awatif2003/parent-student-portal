import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import ParentDashboard from "../pages/parent/ParentDashboard";
import Attendance from "../pages/parent/Attendance";
import MyChildren from "../pages/parent/MyChildren";
import ParentSponsor from "../pages/parent/ParentSponsor";
import Invoice from "../pages/parent/finance/Invoice";
import Receipts from "../pages/parent/finance/Receipts";
import ContinuousAssessments from "../pages/parent/results/ContinuousAssessments";
import StudentResultCard from "../pages/parent/results/StudentResultCard";
import TermResults from "../pages/parent/results/TermResults";
import StudentAttendance from "../pages/student/StudentAttendance";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentDetails from "../pages/student/StudentDetails";
import StudentContinuousAssessment from "../pages/student/results/ContinuousAssessment";
import StudentResults from "../pages/student/results/StudentResults";
import StudentTermResults from "../pages/student/results/TermResults";
import Notifications from "../pages/shared/Notifications";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/sponsor"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <ParentSponsor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/children"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <MyChildren />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/attendance"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/results/continuous-assessments"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <ContinuousAssessments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/results/term-results"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <TermResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/results/student-result-card"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <StudentResultCard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/finance/invoice"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <Invoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/finance/receipts"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <Receipts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/notifications"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/details"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results/continuous-assessment"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentContinuousAssessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results/term-results"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentTermResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notifications"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
