export default function AdminCategories() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Features</th>
            <th className="p-3 text-left">Description</th>
          </tr>
        </thead>

        <tbody>
          {/* Category 1 */}
          <tr className="border-b">
            <td className="p-3">
              <img
                src="https://via.placeholder.com/80"
                alt="room"
                className="w-16 h-16 rounded"
              />
            </td>
            <td className="p-3">Deluxe Room</td>
            <td className="p-3">$120</td>
            <td className="p-3">
              AC, WiFi, TV
            </td>
            <td className="p-3">
              Comfortable deluxe room with modern facilities
            </td>
          </tr>

          {/* Category 2 */}
          <tr className="border-b">
            <td className="p-3">
              <img
                src="https://via.placeholder.com/80"
                alt="room"
                className="w-16 h-16 rounded"
              />
            </td>
            <td className="p-3">Standard Room</td>
            <td className="p-3">$80</td>
            <td className="p-3">
              Fan, WiFi
            </td>
            <td className="p-3">
              Budget friendly room for short stays
            </td>
          </tr>

          {/* Category 3 */}
          <tr>
            <td className="p-3">
              <img
                src="https://via.placeholder.com/80"
                alt="room"
                className="w-16 h-16 rounded"
              />
            </td>
            <td className="p-3">Luxury Suite</td>
            <td className="p-3">$250</td>
            <td className="p-3">
              AC, WiFi, TV, Jacuzzi
            </td>
            <td className="p-3">
              Premium luxury suite with high-end services
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}