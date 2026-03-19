export default function AdminUsers() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">WhatsApp</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Email Verified</th>
          </tr>
        </thead>

        <tbody>
          {/* User 1 */}
          <tr className="border-b">
            <td className="p-3">Kamal Perera</td>
            <td className="p-3">kamal@gmail.com</td>
            <td className="p-3">Customer</td>
            <td className="p-3">0771234567</td>
            <td className="p-3">0719876543</td>
            <td className="p-3">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
                Active
              </span>
            </td>
            <td className="p-3">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
                Verified
              </span>
            </td>
          </tr>

          {/* User 2 */}
          <tr className="border-b">
            <td className="p-3">Nimal Silva</td>
            <td className="p-3">nimal@gmail.com</td>
            <td className="p-3">Admin</td>
            <td className="p-3">0775554444</td>
            <td className="p-3">0751112222</td>
            <td className="p-3">
              <span className="bg-red-200 text-red-800 px-2 py-1 rounded">
                Disabled
              </span>
            </td>
            <td className="p-3">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
                Verified
              </span>
            </td>
          </tr>

          {/* User 3 */}
          <tr>
            <td className="p-3">Saman Kumara</td>
            <td className="p-3">saman@gmail.com</td>
            <td className="p-3">Customer</td>
            <td className="p-3">0778889999</td>
            <td className="p-3">0703334444</td>
            <td className="p-3">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
                Active
              </span>
            </td>
            <td className="p-3">
              <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                Not Verified
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}