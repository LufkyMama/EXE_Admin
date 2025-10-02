/* eslint-disable react-refresh/only-export-components */
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/{auth}/Dashboard';
import Transactions from '@/pages/{auth}/Transaction';
import Users from '@/pages/{auth}/Users';
import Challenges from '@/pages/{auth}/Challenges';
import Settings from '@/pages/{auth}/Settings';
import Login from '@/pages/{auth}/Login';
import Register from '@/pages/{auth}/Register';
import useAuth from '@/hooks/useAuth';


function PrivateRoute(){
const { user, loading } = useAuth();
if (loading) return <div className="p-8">Loading…</div>;
return user ? <Outlet/> : <Navigate to="/login" replace/>;
}


export const router = createBrowserRouter([
{
element: <PrivateRoute/>,
children: [{
element: <AppLayout/>,
children: [
{ path: '/', element: <Dashboard/> },
{ path: '/transactions', element: <Transactions/> },
{ path: '/users', element: <Users/> },
{ path: '/challenges', element: <Challenges/> },
{ path: '/settings', element: <Settings/> },
],
}],
},
{ path: '/login', element: <Login/> },
{ path: '/register', element: <Register/> },
]);