// HOC
import withLayoutHooks from 'HOC/withLayoutHooks';
// Containers
import DashboardContainer from './Dashboard';
import FilesContainer from './Files';

export const Dashboard = withLayoutHooks(DashboardContainer)
export const Files =  withLayoutHooks(FilesContainer)