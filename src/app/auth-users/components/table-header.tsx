export default function TableHeader() {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-3xl font-extralight text-white/50">Auth Users</h3>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Add User
      </button>
    </div>
  );
}
