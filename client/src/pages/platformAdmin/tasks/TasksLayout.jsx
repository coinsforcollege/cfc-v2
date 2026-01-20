import React from 'react';
import { Outlet } from 'react-router';
import DashboardLayout from '../../../layouts/DashboardLayout';

const TasksLayout = () => {
    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
};

export default TasksLayout;
