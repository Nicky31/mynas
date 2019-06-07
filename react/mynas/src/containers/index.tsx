// HOC
import withBreadcrumb from 'HOC/withBreadcrumb';
// Containers
import DashboardContainer from './Dashboard';
import FilesContainer from './Files';

export const Dashboard = withBreadcrumb(DashboardContainer)
export const Files =  withBreadcrumb(FilesContainer)