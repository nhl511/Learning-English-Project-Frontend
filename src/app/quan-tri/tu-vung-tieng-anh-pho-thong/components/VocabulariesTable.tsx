import React from 'react';
import {
    ColumnDef, ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel, SortingState, VisibilityState
} from "@tanstack/table-core";
import {DataList, Vocabulary} from "@/types";
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
import {getAllVocabularies, updateVocabularyStatus} from "@/services/apis/vocabularies.service";
import {useToast} from "@/hooks/use-toast";
import {AlertDialog, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import Alert from "@/app/quan-tri/tu-vung-tieng-anh-pho-thong/components/Alert";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import Update from "@/app/quan-tri/tu-vung-tieng-anh-pho-thong/components/Update";
import useSWR from "swr";

const VocabulariesTable = ({selectedCurriculumId, selectedGradeId, selectedUnitId}:{selectedCurriculumId: string | null, selectedGradeId: string | null, selectedUnitId: string | null}) => {
    const [page, setPage] = React.useState<number>(PAGE.INITIAL);
    const {data, isLoading, mutate} = useSWR(`api/vocabularies?page=${page}&curriculumId=${selectedCurriculumId}&gradeId=${selectedGradeId}&unitId=${selectedUnitId}`, () => getAllVocabularies({
        page,
        pageSize: PAGE.SIZE,
        curriculumId: selectedCurriculumId,
        gradeId: selectedGradeId,
        unitId: selectedUnitId,
    }))
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const {toast} = useToast();
    const [vocabularyId, setVocabularyId] = React.useState<string>("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [vocabulary, setVocabulary] = React.useState<string>("")
    const [definition, setDefinition] = React.useState<string>("")
    const [transcription, setTranscription] = React.useState<string>("")
    const [curriculumId, setCurriculumId] = React.useState<string>("")
    const [gradeId, setGradeId] = React.useState<string>("")
    const [unitId, setUnitId] = React.useState<string>("")
    const [notes, setNotes] = React.useState<string>("")


    const columns: ColumnDef<Vocabulary>[] = [
        {
            id: "serial",
            header: "STT",
            cell: ({ row }) => (
                <div>{(page - 1) * PAGE.SIZE + row.index + 1}</div>
            ),
        },
        {
            accessorKey: "WORD",
            header: "Từ vựng",
            cell: ({ row }) => (
                <div>{row.getValue("WORD")}</div>
            ),
        },
        {
            accessorKey: "DEFINITION",
            header: "Định nghĩa",
            cell: ({ row }) => (
                <div>{row.getValue("DEFINITION")}</div>
            ),
        },
        {
            accessorKey: "TRANSCRIPTION",
            header: "Phiên âm",
            cell: ({ row }) => (
                <div>{row.getValue("TRANSCRIPTION")}</div>
            ),
        },
        {
            accessorKey: "PARTS_OF_SPEECH",
            header: "Từ loại",
            cell: ({ row }) => {
                const name = row.original.NOTES
                return <div>{name}</div>;
            },
        },
        {
            accessorKey: "UNIT",
            header: "Unit",
            cell: ({ row }) => {
                const number = row.original.UNIT.UNIT_NUMBER
                const name = row.original.UNIT.UNIT_NAME
                return <div>{`Unit ${number} - ${name}`}</div>;
            },
        },
        {
            accessorKey: "GRADE",
            header: "Lớp",
            cell: ({ row }) => {
                const grade = row.original.UNIT.GRADE.GRADE_NUMBER
                return <div>Grade {grade}</div>;
            },
        },
        {
            accessorKey: "CURRICULUM",
            header: "Giáo trình",
            cell: ({ row }) => {
                const curriculum = row.original.UNIT.GRADE.CURRICULUM.NAME
                return <div>{curriculum}</div>;
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
                                const result = await updateVocabularyStatus({
                                    id: item.ID,
                                    active: !item.ACTIVE,
                                })
                                switch (result?.code) {
                                    case CODE.SUCCESS:
                                        await mutate();
                                        toast({
                                            description: "Cập nhật trạng thái từ vựng thành công",
                                        })
                                }
                            }}>
                                {item.ACTIVE ? "Ẩn" : "Hiện"}
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onClick={()=>{
                                    setVocabularyId(item.ID)
                                    setVocabulary(item.WORD)
                                    setDefinition(item.DEFINITION)
                                    setTranscription(item.TRANSCRIPTION)
                                    setCurriculumId(item.UNIT.GRADE.CURRICULUM.ID)
                                    setGradeId(item.UNIT.GRADE.ID)
                                    setUnitId(item.UNIT.ID)
                                    setNotes(item.NOTES)
                                }}>
                                    Chỉnh sửa
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onClick={()=> {setVocabularyId(item.ID)}}>Xoá</DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
                }}
    ]

    const table = useReactTable({
        data: data?.data && "vocabularies" in data.data ? data.data.vocabularies : [],
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
                        onClick={() => setPage((prev: number)=> prev - 1)}
                        disabled={page === 1}
                    >
                        Trước
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev: number)=> prev + 1)}
                        disabled={10 * page >= (data?.data as DataList)?.count}
                    >
                        Sau
                    </Button>
                </div>
                <Update id={vocabularyId} vocabulary={vocabulary} definition={definition} transcription={transcription}
                        curriculumId={curriculumId} setCurriculumId={setCurriculumId}
                        gradeId={gradeId} setGradeId={setGradeId} unitId={unitId} notes={notes} mutate={mutate}
                        isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}/>
            </Dialog>
            <Alert id={vocabularyId} mutate={mutate}/>
        </AlertDialog>
    );
};

export default VocabulariesTable;