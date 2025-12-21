import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

const Loading = () => {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">User Management</h2>
      </div>
      <DataTableSkeleton
        columnCount={8}
        rowCount={10}
        filterCount={2}
        withPagination
        withViewOptions
      />
    </div>
  );
};

export default Loading;
