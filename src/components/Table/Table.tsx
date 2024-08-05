import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Define the type for the array items
interface Invoice {
  img: string;
  invoice: string;
  author: string;
}

// Define the type for the props
interface TableDemoProps {
  array: Invoice[];
  name: string;
}

export function TableDemo({ array, name }: TableDemoProps) {
  return (
    <Table className="">
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="text-center text-lg">{name}</TableHead>
        </TableRow>
      </TableHeader>

      {/* <TableBody> */}
        {array.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img style={{ width: "240px", height: "120px", borderRadius: "10px" }} src={invoice.img} alt={invoice.invoice} />
                <p className="text-xl">{invoice.invoice}</p>
                <p>{invoice.author}</p>
              </div>
            </TableCell>
          </TableRow>
        ))}
    </Table>
  )
}

export default TableDemo
