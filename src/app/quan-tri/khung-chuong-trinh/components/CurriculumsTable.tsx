"use client"
import React from 'react';
import {
    ColumnDef, ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, SortingState, VisibilityState
} from "@tanstack/table-core";
import {Curriculum, ResponseData} from "@/types";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {useToast} from "@/hooks/use-toast";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {CODE} from "@/constant/constant";
import { updateCurriculumStatus} from "@/services/apis/curriculums.servicee";
import {AlertDialog, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import Alert from "@/app/quan-tri/khung-chuong-trinh/components/Alert";
import Update from "@/app/quan-tri/khung-chuong-trinh/components/Update";
import {KeyedMutator} from "swr";

const CurriculumsTable = ({data, isLoading, mutate}:{data: ResponseData | undefined, isLoading: boolean, mutate: KeyedMutator<ResponseData>}) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [curriculumId, setCurriculumId] = React.useState<string>("")
    const [curriculumName, setCurriculumName] = React.useState<string>("")
    const {toast} = useToast();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const columns: ColumnDef<Curriculum>[] = [
        {
            id: "serial",
            header: "STT",
            cell: ({ row }) => (
                <div>{row.index + 1}</div>
            ),
        },
        {
            accessorKey: "NAME",
            header: "Tên giáo trình",
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
            cell: ({ row }) => {
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
                                const result = await updateCurriculumStatus({
                                    id: item.ID,
                                    active: !item.ACTIVE,
                                    jwt: localStorage.getItem("access-token")
                                })
                                switch (result?.code) {
                                    case CODE.SUCCESS:
                                        await mutate();
                                        toast({
                                            description: "Cập nhật trạng thái giáo trình thành công",
                                        })
                                }
                            }}>
                                {item.ACTIVE ? "Ẩn" : "Hiện"}
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onClick={()=>{
                                    setCurriculumId(item.ID)
                                    setCurriculumName(item.NAME)
                                }}>
                                            Chỉnh sửa
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onClick={()=> {setCurriculumId(item.ID)}}>Xoá</DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }}
    ]

    const table = useReactTable({
        data: data?.data && "curriculums" in data.data ? data.data.curriculums : [],
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
                <Alert id={curriculumId} mutate={mutate}/>
                <Update
                    id={curriculumId}
                    name={curriculumName}
                    mutate={mutate}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                />
            </Dialog>
        </AlertDialog>
    );
};

export default CurriculumsTable;