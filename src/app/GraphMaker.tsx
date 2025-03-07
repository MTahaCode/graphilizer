"use client"

import React, {useState, useRef, FormEvent} from 'react'
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line } from 'recharts'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import EditBox from './components/EditableCell';
import EditableCell from './components/EditableCell';

interface Props {}

const getRandomColor = () => {
    let color;
  do {
    color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  } while (color.toLowerCase() === "#000000" || color.toLowerCase() === "#ffffff" || color.length < 7);
  return color;
};

const GraphMaker: React.FC<Props> = () => {

    const newColumnColor = useRef<HTMLInputElement>(null);
    const newColumnName = useRef<HTMLInputElement>(null);

    const [data, setData] = useState([
        { x: "Jan", sales: 400, revenue: 700, profit: 200 },
        { x: "Feb", sales: 300, revenue: 600, profit: 150 },
        { x: "Mar", sales: 500, revenue: 800, profit: 300 },
        { x: "Apr", sales: 600, revenue: 900, profit: 400 },
        { x: "May", sales: 700, revenue: 1000, profit: 500 },
    ]);

    const [variables, setVariables] = useState([
        {
            accessorKey: "x",
            header: "Month",
            color: "red"
        },
        {
            accessorKey: "sales",
            header: "Sales",
            color: "blue"
        }
    ])

    const table = useReactTable({
        columns: variables,
        data,
        getCoreRowModel: getCoreRowModel(),
    })

    const addNewColumn = async (event: FormEvent) => {
        event.preventDefault();
        
        if (newColumnName.current && newColumnColor.current) {
            
            const name = newColumnName.current.value.trim();
            const color = newColumnColor.current.value.trim();

            if (name == "" && color == "") {
                return;
            }

            setVariables(prevVars => [...prevVars, {
                accessorKey: name.toLowerCase(), 
                header: name,
                color: color
            }])

            setData((prev) => {
                return prev.map(row => {
                    const newCol = { ...row, [name]: 0};
                    console.log(newCol);
                    return newCol;
                })
            })

            newColumnName.current.value = "";
            newColumnColor.current.value = "";
        }
    }

    const updateData = (rowIndex: number, columnIndex: string, newValue: number) => {
        setData((prevData) => (
            prevData.map((row, index) => (
                (index === rowIndex) ? { ...row, [columnIndex]: newValue} : row
            ))
        ))
    }

    return (
        <>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="10 10" />
                    <XAxis dataKey="x"/>
                    <YAxis />
                    <Tooltip />
                    {variables.map((row) => (
                        <Line type="monotone" dataKey={row.accessorKey} stroke={row.color} strokeWidth={2} />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            <form onSubmit={addNewColumn}>
                <label htmlFor="new-col-name">Name: <input type="text" ref={newColumnName} id="new-col-name"/></label>
                <label htmlFor="new-col-color">Column: <input type="text" ref={newColumnColor} id="new-col-color"/></label>
                <button type="submit">Add Column</button>
            </form>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                    {headerGroup.headers.map((column) => (
                        <th key={column.id} style={{ border: "1px solid white", padding: "8px" }}>
                        {flexRender(column.column.columnDef.header, column.getContext())}
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} style={{ border: "1px solid white", padding: "8px" }}>
                            <EditableCell 
                                state={cell.getValue()} 
                                setter={(newValue) => updateData(row.index, cell.column.id, newValue)} 
                            />
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default GraphMaker
