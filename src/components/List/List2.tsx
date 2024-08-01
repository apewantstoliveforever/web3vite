export function TypographyTable() {
    return (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                Title
              </th>
              <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                Fullname
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                Lý Hoài Lâm
              </td>
            </tr>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                Address
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                Tân Bình, Hồ Chí Minh
              </td>
            </tr>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                Number Phone
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                036265066
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  

  export default TypographyTable;