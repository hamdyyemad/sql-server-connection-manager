import { CloudflareActivityItem as ICloudflareActivityItem } from "../../types/activity-item";
import CloudflareActivityItem from "./cloudflare-activity-item";

const activityFeedData: ICloudflareActivityItem[] = [
  {
    time: "2 min ago",
    event: "DDoS attack blocked from 192.168.1.100",
    type: "security",
    severity: "high",
  },
  {
    time: "5 min ago",
    event: "Cache hit rate improved to 94.2%",
    type: "performance",
    severity: "info",
  },
  {
    time: "8 min ago",
    event: "New SSL certificate deployed",
    type: "ssl",
    severity: "info",
  },
  {
    time: "12 min ago",
    event: "Bot traffic detected and filtered",
    type: "security",
    severity: "medium",
  },
  {
    time: "15 min ago",
    event: "CDN edge server optimized",
    type: "performance",
    severity: "info",
  },
  {
    time: "18 min ago",
    event: "SQL injection attempt blocked",
    type: "security",
    severity: "high",
  },
  {
    time: "22 min ago",
    event: "Bandwidth usage spike detected",
    type: "traffic",
    severity: "warning",
  },
  {
    time: "25 min ago",
    event: "New country added to traffic analytics",
    type: "analytics",
    severity: "info",
  },
];

export default function CloudflareActivityItems() {
  return (
    <>
      {activityFeedData.map((item, index) => (
        <CloudflareActivityItem key={index} item={item} index={index} />
      ))}
    </>
  );
}
