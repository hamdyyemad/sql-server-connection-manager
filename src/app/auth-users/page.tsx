import Table from "./components/table";
import TableHeader from "./components/table-header";

export default function AuthUsers() {
  return (
    <div className="p-6 space-y-6">
      <TableHeader />
      <Table />
    </div>
  );
}
