import React from 'react';
import {
    ColumnDef, ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, SortingState, VisibilityState
} from "@tanstack/table-core";
import { PartsOfSpeech} from "@/types";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Copy, MoreHorizontal} from "lucide-react";
import {CODE} from "@/constant/constant";
import {useToast} from "@/hooks/use-toast";
import {updatePartsOfSpeechStatus} from "@/services/apis/partsOfSpeech.service";
import {AlertDialog, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import Alert from "@/app/quan-tri/tu-loai/components/Alert";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import Update from "@/app/quan-tri/tu-loai/components/Update";

const PartsOfSpeechTable = ({data, isLoading, mutate}:{data: any, isLoading: boolean, mutate: any}) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const {toast} = useToast();
    const [partsOfSpeechId, setPartsOfSpeechId] = React.useState<string>("")
    const [partsOfSpeechName, setPartsOfSpeechName] = React.useState<string>("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);


    const columns: ColumnDef<PartsOfSpeech>[] = [
        {
            id: "serial",
            header: "STT",
            cell: ({ row }) => (
                <div>{row.index + 1}</div>
            ),
        },
        {
            accessorKey: "ID",
            header: "ID",
            cell: ({ row }) => {
                const id = row.original.ID
                return <div><Copy size={14} className="cursor-pointer" onClick={()=> {
                    navigator.clipboard.writeText(id)
                    toast({description: "Đã copy"})
                }}/></div>;
            },
        },
        {
            accessorKey: "NAME",
            header: "Từ loại",
            cell: ({ row }) => (
                <div>{row.getValue("NAME")}</div>
            ),
        },
        {
            accessorKey: "ACTIVE",
            header: "Trạng thái",
            cell: ({ row }) => <div>{row.getValue("ACTIVE") ? "Hiện" : "Ẩn"}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({row}) => {
                const item = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem onClick={async () => {
                                const result = await updatePartsOfSpeechStatus({
                                    id: item.ID,
                                    active: !item.ACTIVE,
                                    jwt: localStorage.getItem("access-token")
                                })
                                switch (result?.code) {
                                    case CODE.SUCCESS:
                                        mutate();
                                        toast({
                                            description: "Cập nhật trạng thái từ loại thành công",
                                        })
                                }
                            }}>
                                {item.ACTIVE ? "Ẩn" : "Hiện"}
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onClick={()=>{
                                    setPartsOfSpeechId(item.ID)
                                    setPartsOfSpeechName(item.NAME)
                                }}>
                                    Chỉnh sửa
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onClick={()=> {setPartsOfSpeechId(item.ID)}}>Xoá</DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    const table = useReactTable({
        data: data?.data && "partsOfSpeeches" in data.data ? data.data.partsOfSpeeches : [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })


    if(isLoading) return <p>loading...</p>

    return (
        <AlertDialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows
                                .map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
                <Update
                    id={partsOfSpeechId}
                    name={partsOfSpeechName}
                    mutate={mutate}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                />
            </Dialog>
            <Alert id={partsOfSpeechId} mutate={mutate}/>
        </AlertDialog>
    );
};

export default PartsOfSpeechTable;