import { ColumnDef, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addPlaylist as setFirebasePlaylist } from "@/firebase/firebase";
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
    accessorKey: "thumbnailColorcode",
    header: ({ column }) => {
      return (
        <button className="flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Album
          <ArrowUpDown size="15" />
        </button>
      );
    },
    cell: ({ row }) => <img className="aspect-square object-cover h-10" src={row.original.thumbnail} />,
  },
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <button className="flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Artist
          <ArrowUpDown size="15" />
        </button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("author")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <button className="flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Song
          <ArrowUpDown size="15" />
        </button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
];

export function MusicTable() {
  const playlists = useStore((state) => state.playlists);
  const completePlaylist = playlists.get("All") ?? [];
  const { setPlaylist } = useStore((state) => state.actions);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: completePlaylist,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const addPlaylist = async () => {
    const selectedMusics = table
      .getSortedRowModel()
      .rows.filter((row) => row.getIsSelected())
      .map((row) => row.original);

    if (!selectedMusics.length) return;
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const playlistTitle = prompt("Enter playlist name", `${month}/${day}`);
    if (!playlistTitle) return;
    setPlaylist(playlistTitle, selectedMusics);
    await setFirebasePlaylist(playlistTitle, selectedMusics);
  };

  return (
    <div className="flex flex-col w-full p-2 border gap-2">
      <p className="self-center mb-2">All Music</p>
      <Button className="w-28" onClick={addPlaylist}>
        ✚ Playlist
      </Button>
      <div className="grid grid-cols-2 grid-rows-2 gap-x-2 h-12 mb-4">
        <label className="text-sm font-light" htmlFor="author">
          Artist
        </label>
        <label className="text-sm font-light" htmlFor="title">
          Song
        </label>
        <Input className="h-8" id="author" value={(table.getColumn("author")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("author")?.setFilterValue(event.target.value)} />
        <Input className="h-8" id="title" value={(table.getColumn("title")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)} />
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
    </div>
  );
}
