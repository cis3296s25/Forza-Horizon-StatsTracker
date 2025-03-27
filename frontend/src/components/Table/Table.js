import React, { useState } from "react";

function Table({list, colNames, pageNum = 0, pageSize = 10}) {
    const [page, setPage] = useState(pageNum);
    const [sortedList, setSortedList] = useState(list);
    const [Ascending, setAscending] = useState(true);

    colNames = list.length > 0 ? Object.keys(list[0]) : [];


    
    const onBack = () => {
        if (page - 1 > -1) {
            setPage(page - 1);
        } else {
            setPage(page);
        }
    }

    const onNext = () => {
        if (page + 1 < list.length / pageSize) {
            setPage(page + 1);
        } else {
            setPage(page);
        }
    }

    const sortByColumn = (col) => {
        let tempSortedList = [...list];
        let newSortDir = !Ascending;

        if (newSortDir) {
            tempSortedList.sort((a, b) => {
                if (a[col] < b[col]) {
                    return -1;
                }
                if (a[col] > b[col]) {
                    return 1;
                }
                return 0;
            });
        }
        else {
            tempSortedList.sort((a, b) => {
                if (a[col] < b[col]) {
                    return 1;
                }
                if (a[col] > b[col]) {
                    return -1;
                }
                return 0;
            });
        }

        setAscending(newSortDir); //keeps track of the current sort direction
        setSortedList(tempSortedList); //updates the sorted list
        
    }

    const currentPage = sortedList.slice(pageSize * page, pageSize * page + pageSize);

    return (
        <div className = "tablestyle">
            {list.length > 0 && (
                <table>
                    cellPadding="0" cellSpacing="0"
                    <thead>
                        <tr>
                            {colNames.map((col, index) => (
                                <th key={index} onClick={() => sortByColumn(col)}>{col.toUpperCase()}
                                <img src = "icons/blackSort.png"/> // need to get a sort arrow icon to display here
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentPage.map((row, index) => (
                            <tr key={index}>
                                {colNames.map((col, index) => (
                                    <td key={index}>{row[col]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan = {colNames.length}>
                                <button className="backBtn" onClick={onBack}>Back</button>
                                <label>{page + 1}</label>
                                <button className="nextBtn"onClick={onNext}>Next</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            )}
            
        </div>
    )
}

export default Table;