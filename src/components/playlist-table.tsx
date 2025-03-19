import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { removePlaylist as removeFirebasePlaylist } from "@/firebase/firebase";
import { Music } from "@/utils/music";
import { useStore } from "@/zustand/store";
import { useState } from "react";

export const columns: ColumnDef<Music>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "thumbnail",
    header: "썸네일",
    cell: ({ row }) => <img className="aspect-square object-cover h-10" src={row.original.thumbnail} />,
  },
  {
    accessorKey: "author",
    header: "가수명",
    cell: ({ row }) => <div>{row.getValue("author")}</div>,
  },
  {
    accessorKey: "title",
    header: "곡명",
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
];

export function PlaylistTable({ selectedPlaylist }: { selectedPlaylist: string }) {
  const playlists = useStore((state) => state.playlists);
  const { setCurrentPlaylist, setCurrentMusic, removePlaylist } = useStore((state) => state.actions);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: playlists.get(selectedPlaylist) ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const deletePlaylist = async () => {
    if (selectedPlaylist === "All") return;
    setCurrentPlaylist("All");
    removePlaylist(selectedPlaylist);
    await removeFirebasePlaylist(selectedPlaylist);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <label htmlFor="author">가수명:</label>
        <Input
          id="author"
          value={(table.getColumn("author")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("author")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <label htmlFor="title">곡명:</label>
        <Input
          id="title"
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => {
                    if (e.target instanceof HTMLButtonElement && e.target.role === "checkbox") return;
                    setCurrentPlaylist(selectedPlaylist);
                    setCurrentMusic(row.index);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
      <Button onClick={deletePlaylist}>Delete Playlist</Button>
    </div>
  );
}
