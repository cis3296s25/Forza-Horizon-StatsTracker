import React, { useState, useEffect } from "react";

function ComparisonTable({ players, stats, colNames, colNameMap = {}, pageNum = 0, pageSize = 10 }) {
    const [page, setPage] = useState(pageNum);
    const [sortedStats, setSortedStats] = useState([]);
    const [Ascending, setAscending] = useState(true);
    const [sortedColumn, setSortedColumn] = useState(null);

    useEffect(() => {
        if (stats && players.length > 0) {
            const statsList = colNames.map(stat => ({
                statName: stat,
                statLabel: colNameMap[stat] || stat.toUpperCase(),
                values: players.map(player => stats[player]?.[stat] || "N/A")  // If the player has no stats, display "N/A"
            }));
            setSortedStats(statsList);

        }

    }, [stats, players, colNames, colNameMap]);




    const onBack = () => {
        if (page - 1 > -1) {
            setPage(page - 1);
        } else {
            setPage(page);
        }
    }

    const onNext = () => {
        if (page + 1 < sortedStats.length / pageSize) {
            setPage(page + 1);
        } else {
            setPage(page);
        }
    }

    const sortByColumn = (col) => {
        const tempSortedList = [...sortedStats];
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
        setSortedStats(tempSortedList);
    };


    const currentPage = sortedStats.slice(pageSize * page, pageSize * page + pageSize);

    return (
        <div className="comparisonTable">
            {sortedStats.length > 0 ? (
                <table cellPadding={0} cellSpacing={0}>
                    <thead>
                        <tr>
                            <th onClick={() => sortByColumn("statName")}>Stats</th>
                            {players.map((player, index) => (
                                <th key={index}>{player}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentPage.map((row, index) => (
                            <tr key={index}>
                                <td>{row.statLabel}</td>
                                {row.values.map((value, idx) => (
                                    <td key={idx}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={players.length + 1}>
                                <button className="backBtn" onClick={onBack}>Back</button>
                                <label>{page + 1}</label>
                                <button className="nextBtn" onClick={onNext}>Next</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>

            ) :( 
                <p>No stats available</p>
            )}
        </div>
    );

}

export default ComparisonTable;