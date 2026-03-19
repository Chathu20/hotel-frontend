export default function AdminBooking() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Management</h1>

      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-[#785D32] text-white">
          <tr>
            <th className="p-3 text-left">Booking ID</th>
            <th className="p-3 text-left">Room ID</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">Start</th>
            <th className="p-3 text-left">End</th>
           
          </tr>
        </thead>

        <tbody>
          {/* Row 1 */}
          <tr className="border-b">
            <td className="p-3">1001</td>
            <td className="p-3">201</td>
            <td className="p-3">kamal@gmail.com</td>
            <td className="p-3">
              <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                Pending
              </span>
            </td>
            <td className="p-3">-</td>
            <td className="p-3">2026-03-20</td>
            <td className="p-3">2026-03-25</td>
            <td className="p-3">Late check-in</td>
            <td className="p-3">2026-03-18</td>
          </tr>

          {/* Row 2 */}
          <tr className="border-b">
            <td className="p-3">1002</td>
            <td className="p-3">305</td>
            <td className="p-3">nimal@gmail.com</td>
            <td className="p-3">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
                Approved
              </span>
            </td>
            <td className="p-3">-</td>
            <td className="p-3">2026-04-01</td>
            <td className="p-3">2026-04-05</td>
            <td className="p-3">VIP guest</td>
            <td className="p-3">2026-03-17</td>
          </tr>

          {/* Row 3 */}
          <tr>
            <td className="p-3">1003</td>
            <td className="p-3">102</td>
            <td className="p-3">saman@gmail.com</td>
            <td className="p-3">
              <span className="bg-red-200 text-red-800 px-2 py-1 rounded">
                Rejected
              </span>
            </td>
            <td className="p-3">Room unavailable</td>
            <td className="p-3">2026-03-22</td>
            <td className="p-3">2026-03-24</td>
            <td className="p-3">-</td>
            <td className="p-3">2026-03-16</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}