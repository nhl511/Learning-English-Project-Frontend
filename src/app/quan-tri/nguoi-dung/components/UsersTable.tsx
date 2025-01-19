"use client"

import React from 'react';
import {User} from "@/types";
import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    VisibilityState
} from "@tanstack/table-core";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import useSWR from "swr";
import {deleteUser, getAllUsers, updateUserAdmin, updateUserStatus} from "@/services/apis/users.service";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useToast} from "@/hooks/use-toast";
import {CODE} from "@/constant/constant";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import Alert from "@/app/quan-tri/nguoi-dung/components/Alert";

const UsersTable = () => {
    const {data, isLoading, mutate} = useSWR("/api/users", () => getAllUsers(localStorage.getItem("access-token")));
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [userId, setUserId] = React.useState<string>("")
    const {toast} = useToast();

    const columns: ColumnDef<User>[] = [
        {
            id: "serial",
            header: "STT",
            cell: ({ row }) => (
                <div>{row.index + 1}</div>
            ),
        },
        {
            accessorKey: "EMAIL",
            header: "Email",
            cell: ({ row }) => (
                <div>{row.getValue("EMAIL")}</div>
            ),
        },
        {
            accessorKey: "LAST_NAME",
            header: "Họ",
            cell: ({ row }) => (
                <div>{row.getValue("LAST_NAME")}</div>
            ),
        },
        {
            accessorKey: "FIRST_NAME",
            header: "Tên",
            cell: ({ row }) => (
                <div>{row.getValue("FIRST_NAME")}</div>
            ),
        },
        {
            accessorKey: "ADMIN",
            header: "Vai trò",
            cell: ({ row }) => <div>{row.getValue("ADMIN") ? "Quản trị viên" : "Người dùng"}</div>,
        },
        {
            accessorKey: "ACTIVE",
            header: "Trạng thái",
            cell: ({ row }) => <div>{row.getValue("ACTIVE") ? null : "Bị khoá"}</div>,
        },
        {
            accessorKey: "EMAIL_VERIFIED_AT",
            header: "Kích hoạt",
            cell: ({ row }) => <div>{row.getValue("EMAIL_VERIFIED_AT") ? "Đã kích hoạt" : "Chưa kích hoạt"}</div>,
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
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem>
                                Xem
                            </DropdownMenuItem>
                            {
                                item.ACTIVE &&
                                <DropdownMenuItem onClick={async()=> {
                                    const result = await updateUserAdmin({id: item.ID, admin: !item.ADMIN, jwt: localStorage.getItem("access-token")})
                                    switch (result?.code) {
                                        case CODE.SUCCESS:
                                            mutate();
                                            toast({
                                                description: "Cập nhật quản trị viên thành công",
                                            })
                                    }
                                }}>
                                    {item.ADMIN ? "Bỏ quyền quản trị" : "Cấp quyền quản trị" }
                                </DropdownMenuItem>
                            }
                            {
                                (!item.ADMIN && item.EMAIL_VERIFIED_AT ) && (
                                    <DropdownMenuItem onClick={async()=> {
                                        const result = await updateUserStatus({id: item.ID, active: !item.ACTIVE, jwt: localStorage.getItem("access-token")})
                                        switch (result?.code) {
                                            case CODE.SUCCESS:
                                                mutate();
                                                toast({
                                                    description: "Cập nhật trạng thái tài khoản thành công",
                                                })
                                        }
                                    }}>
                                        {item.ACTIVE ? "Khoá tài khoản" : "Mở khoá tài khoản" }
                                    </DropdownMenuItem>
                                )
                            }
                            <DropdownMenuSeparator />
                            {
                                (!item.ADMIN && !item.EMAIL_VERIFIED_AT) && (
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onClick={()=> {setUserId(item.ID)}}>Xoá tài khoản</DropdownMenuItem>
                                    </AlertDialogTrigger>
                                )
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: data?.data && "users" in data.data ? data.data.users : [],
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
            <div className="mt-5">
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
            </div>
           <Alert id={userId} mutate={mutate}/>
        </AlertDialog>
    );
};

export default UsersTable;