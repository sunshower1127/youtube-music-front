import r2 from "@/services/r2";
import { Music } from "@/types/music";

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { CircleArrowDownIcon, CircleArrowUpIcon, CircleDotIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox.tsx";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const columns: ColumnDef<Music>[] = [
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
    accessorKey: "metadata.meanHue",
    header: ({ column }) => <ToggleHeader column={column}>Cover</ToggleHeader>,
    cell: ({ row }) => <img className="aspect-video object-contain h-10" src={r2.getThumbnailURL(row.original)!} />,
  },
  {
    accessorKey: "artist",
    header: ({ column }) => <ToggleHeader column={column}>Artist</ToggleHeader>,
    cell: ({ row }) => <div>{row.original.artist}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <ToggleHeader column={column}>Title</ToggleHeader>,

    cell: ({ row }) => <div>{row.original.title}</div>,
  },
  {
    accessorKey: "metadata.moodValue",
    header: ({ column }) => <ToggleHeader column={column}>Mood</ToggleHeader>,
    cell: ({ row }) => <div>{row.original.metadata.moodValue}</div>,
  },
];

function ToggleHeader({ children, column }: { children: ReactNode; column: Column<Music> }) {
  const isSorted = column.getIsSorted();
  let Icon, handleClick;
  switch (isSorted) {
    case false:
      Icon = CircleDotIcon;
      handleClick = () => column.toggleSorting(false, true);
      break;
    case "asc":
      Icon = CircleArrowUpIcon;
      handleClick = () => column.toggleSorting(true, true);
      break;
    case "desc":
      Icon = CircleArrowDownIcon;
      handleClick = () => column.clearSorting();
  }

  return (
    <button className="flex items-center gap-2" onClick={handleClick}>
      {children}
      <Icon size="15" />
    </button>
  );
}

export function MusicTable({
  musics,
  selection,
  onSelectionChange,
}: {
  musics: Music[];
  selection: Record<number, boolean>;
  onSelectionChange?: OnChangeFn<RowSelectionState>;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: musics,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: onSelectionChange,
    state: {
      sorting,
      rowSelection: selection,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className="flex flex-col w-full p-2 border gap-2">
      <pre>{JSON.stringify(sorting, null, 2)}</pre>
      <div className="grid grid-cols-2 grid-rows-2 gap-x-2 h-12 mb-4">
        <label className="text-sm font-light" htmlFor="artist">
          Artist
        </label>
        <label className="text-sm font-light" htmlFor="title">
          Song
        </label>
        <Input
          className="h-8"
          id="artist"
          value={(table.getColumn("artist")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("artist")?.setFilterValue(event.target.value)}
        />
        <Input
          className="h-8"
          id="title"
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
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

//   const addPlaylist = async () => {
//     const selectedMusics = table
//       .getSortedRowModel()
//       .rows.filter((row) => row.getIsSelected())
//       .map((row) => row.original);

//     if (!selectedMusics.length) return;
//     const today = new Date();
//     const month = today.getMonth() + 1;
//     const day = today.getDate();
//     const playlistTitle = prompt("Enter playlist name", `${month}/${day}`);
//     if (!playlistTitle) return;
//     setPlaylist(playlistTitle, selectedMusics);
//     await setFirebasePlaylist(playlistTitle, selectedMusics);
//   };
