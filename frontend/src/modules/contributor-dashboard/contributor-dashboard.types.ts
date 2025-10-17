export type ContributorDashboardProps = {
  onLogout: () => void;
  onNavigate?: (view: string, data?: any, readOnly?: boolean) => void;
};
