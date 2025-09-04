export interface SummaryStatsItem {
    id: number;
    title: string;
    value: string;
}


export interface AnalyticsDataItem {
    ip: string;
    country: string;
    city: string;
    requests: number;
    bandwidth: string;
    threats: number;
    status: string;
    lastSeen: string;
}