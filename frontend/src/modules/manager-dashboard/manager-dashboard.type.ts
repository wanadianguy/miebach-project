export type ManagerDashboardProps = {
  onLogout: () => void;
  onNavigate?: (view: string, data?: any, readOnly?: boolean) => void;
};
