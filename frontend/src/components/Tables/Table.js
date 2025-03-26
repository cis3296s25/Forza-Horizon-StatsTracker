import React, { useState } from "react";

function Table({list, colNames, pageNum = 0, pageSize = 10}) {
    const [page, setPage] = useState(pageNum);
    
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

    return (
        <div>
            {list.length > 0 && (
                <table>
                    cellPadding="0" cellSpacing="0"
                    <thead>
                        <tr>
                            {colNames.map((col, index) => (
                                <th key={index}>{col.toUpperCase()}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(list.slice(pageSize * page, pageSize * page + pageSize))// page 0, page 10
                        .map((obj, index) => (
                            <tr key={index}>
                                {Object.values(obj).map((value, index2) => (
                                    <td key={index2}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <td></td>
                        <td>
                            <button onClick={onBack}>Back</button>
                            <label>{page + 1}</label>
                            <button onClick={onNext}>Next</button>
                        </td>
                    </tfoot>
                </table>
            )}
            
        </div>
    )
}

export default Table;