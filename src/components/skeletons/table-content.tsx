import { IconDotsVertical } from "@tabler/icons-react";
import { Button, Skeleton } from "../ui";
import { TableRow, TableCell } from "../ui/table";

const TableContentSkeleton = () => {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="ml-auto h-4 w-12" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-12" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-12" />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
        </Button>
      </TableCell>
    </TableRow>
  ));
};

export default TableContentSkeleton;
