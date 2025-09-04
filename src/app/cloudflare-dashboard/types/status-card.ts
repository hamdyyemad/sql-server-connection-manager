export interface StatusCardData {
  title: string;
  value: string;
  change: string;
  changeType: string;
  icon: React.ReactNode;
  iconBgColor: string;
  chartData: {
    labels: string[];
    data: number[];
    color: string;
  };
}