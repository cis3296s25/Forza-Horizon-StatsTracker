import React, { useState, useEffect } from "react";

function LeaderBoardTable({ list, colNames, colNameMap = {}, pageNum = 0, pageSize = 10 }) {
    const [page, setPage] = useState(pageNum);
    const [sortedList, setSortedList] = useState([]);
    const [Ascending, setAscending] = useState(true);
    const [sortedColumn, setSortedColumn] = useState(null);


    useEffect(() => {
        // Ensure list is an array before setting sortedList
        if (Array.isArray(list)) {
            setSortedList(list);
        }
    }, [list]);


    const onBack = () => {
        if (page - 1 > -1) {
            setPage(page - 1);
        } else {
            setPage(page);
        }
    };


    const onNext = () => {
        if (page + 1 < sortedList.length / pageSize) {
            setPage(page + 1);
        } else {
            setPage(page);
        }
    };


    const sortByColumn = (col) => {
        const tempSortedList = [...sortedList];
        const newSortDir = col === sortedColumn ? !Ascending : true;

        tempSortedList.sort((a, b) => {
            if (a[col] < b[col]) {
                return newSortDir ? -1 : 1;
            } else {
                return newSortDir ? 1 : -1;
            }
        });





        setSortedColumn(col);
        setAscending(newSortDir);
        setSortedList(tempSortedList);
    };




    const currentPage = sortedList.slice(pageSize * page, pageSize * page + pageSize);


    return (
        <div className="tablestyle">
            {sortedList.length > 0 && (
                <table cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                        <th>Rank</th>
                            {colNames.map((col, index) => (
                                <th key={index} onClick={() => sortByColumn(col)}>
                                    {colNameMap[col] || col.toUpperCase()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentPage.map((row, index) => (
                            <tr key={index}>
                                <td>{page * pageSize + index + 1}</td>
                                {colNames.map((col, index) => (
                                    <td key={index}>{row[col]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={colNames.length + 1}>
                                <button className="backBtn" onClick={onBack}>
                                    Back
                                </button>
                                <label>{page + 1}</label>
                                <button className="nextBtn" onClick={onNext}>
                                    Next
                                </button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </div>
    );
}


export default LeaderBoardTable;