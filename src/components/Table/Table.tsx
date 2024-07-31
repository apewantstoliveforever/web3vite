import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export function TableDemo( {array, name} ) {
  return (
    <Table className="">
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="text-center text-lg" >{name}</TableHead>

        </TableRow>
      </TableHeader>

      {/* <TableBody> */}
        {array.map((invoice) => (
          // <TableRow key={invoice.invoice}>
            <TableCell>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img style={{ width: "240px", height: "120px",borderRadius: "10px" }} src={invoice.img} />
                <p className="text-xl">{invoice.invoice}</p>
                <p className="">{invoice.author}</p>
              </div>
            </TableCell>
          // </TableRow>
        ))}
      {/* </TableBody> */}
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  )
}

export default TableDemo



