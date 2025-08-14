export default function ProductsList({ products }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Reorder Level</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr key={index}>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>{p.reorderLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
