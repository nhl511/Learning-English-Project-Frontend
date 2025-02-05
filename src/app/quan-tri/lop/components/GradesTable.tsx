"use client"
import React from 'react';
import {
    ColumnDef, ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel, SortingState, VisibilityState
} from "@tanstack/table-core";
import {DataList, Grade, ResponseData} from "@/types";
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
import {MoreHorizontal} from "lucide-react";
import {CODE, PAGE} from "@/constant/constant";
import {useToast} from "@/hooks/use-toast";
import {getAllGrades, updateGradeStatus} from "@/services/apis/grades.service";
import {AlertDialog, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import Alert from "@/app/quan-tri/lop/components/Alert";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import Update from "@/app/quan-tri/lop/components/Update";
import useSWR from "swr";

const GradesTable = () => {
    const [page, setPage] = React.useState(PAGE.INITIAL);

    const {data, isLoading, mutate} = useSWR<ResponseData>(`api/grades?page=${page}`, () => getAllGrades({
        jwt: localStorage.getItem("access-token"),
        page,
        pageSize: PAGE.SIZE,
    }));

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const {toast} = useToast();
    const [gradeId, setGradeId] = React.useState<string>("")
    const [grade, setGrade] = React.useState<number>(0)
    const [curriculumId, setCurriculumId] = React.useState<string>("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const columns: ColumnDef<Grade>[] = [
        {
            id: "serial",
            header: "STT",
            cell: ({ row }) => (
                <div>{(page - 1) * PAGE.SIZE + row.index + 1}</div>
            ),
        },
        {
            accessorKey: "GRADE_NUMBER",
            header: "Lớp",
            cell: ({ row }) => (
                <div>Lớp {row.getValue("GRADE_NUMBER")}</div>
            ),
        },
        {
            accessorKey: "CURRICULUM",
            header: "Giáo trình",
            cell: ({ row }) => {
                const name = row.original.CURRICULUM.NAME
                return <div>{name}</div>;
            },
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
                                const result = await updateGradeStatus({
                                    id: item.ID,
                                    active: !item.ACTIVE,
                                    jwt: localStorage.getItem("access-token")
                                })
                                switch (result?.code) {
                                    case CODE.SUCCESS:
                                        mutate();
                                        toast({
                                            description: "Cập nhật trạng thái lớp thành công",
                                        })
                                }
                            }}>
                                {item.ACTIVE ? "Ẩn" : "Hiện"}
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onClick={()=>{
                                    setGradeId(item.ID)
                                    setGrade(item.GRADE_NUMBER)
                                    setCurriculumId(item.CURRICULUM.ID)
                                }}>
                                    Chỉnh sửa
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onClick={()=> {setGradeId(item.ID)}}>Xoá</DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    const table = useReactTable({
        data: data?.data && "grades" in data.data ? data.data.grades : [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
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
        manualPagination: true,
        rowCount: (data?.data as DataList)?.count,
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
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev: number) => prev - 1)}
                        disabled={page === 1}
                    >
                        Trước
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev: number) => prev + 1)}
                        disabled={10 * page >= (data?.data as DataList)?.count}
                    >
                        Sau
                    </Button>
                </div>
                <Update
                    id={gradeId}
                    grade={grade}
                    curriculumId={curriculumId}
                    mutate={mutate}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                />
            </Dialog>

            <Alert id={gradeId} mutate={mutate}/>
        </AlertDialog>

    );
};

export default GradesTable;