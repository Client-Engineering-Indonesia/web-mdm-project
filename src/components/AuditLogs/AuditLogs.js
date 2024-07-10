import './AuditLogs.css';
import { datas } from './AuditLogsdata.js';
import React, { useState } from 'react';
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    Search,
    Pagination,
} from '@carbon/react';


const headers = [
    { key: 'Timestamp', header: 'Timestamp' },
    { key: 'Interface', header: 'Interface' },
    { key: 'UserName', header: 'UserName' },
    { key: 'UserGroup', header: 'UserGroup' },
    { key: 'Role', header: 'Role' },
    { key: 'Activity', header: 'Activity' },
    { key: 'Message', header: 'Message' },
];

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function AuditLogs() {
    const [searchInput, setSearchInput] = useState('');
    const [filteredRows, setFilteredRows] = useState(datas);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchInput(value);
        const filtered = datas.filter((row) =>
            Object.values(row).some((cell) =>
                String(cell).toLowerCase().includes(value)
            )
        );
        setFilteredRows(filtered);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        setCurrentPage(1); // Reset to first page
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedRows = filteredRows.slice(startIndex, endIndex);

    return (
        <section className='auditlogs'>
            <div className='auditlogs-content'>


                <div className='options'>
                    <div className='title'>
                        Activity Log
                    </div>
                    <div className='search'>
                        <Search
                            className='search-bar'
                            size="lg"
                            placeholder="Search"
                            labelText="Search"
                            closeButtonLabelText="Clear search input"
                            id="search-1"
                            value={searchInput}
                            onChange={handleSearch}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                <div className='audit-tables'>
                    <DataTable rows={paginatedRows} headers={headers} style={{ width: '900px' }}>
                        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                            <Table {...getTableProps()}>
                                <TableHead>
                                    <TableRow>
                                        {headers.map((header) => (
                                            <TableHeader {...getHeaderProps({ header })}>
                                                {header.header}
                                            </TableHeader>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow {...getRowProps({ row })}>
                                            {row.cells.map((cell) => (
                                                <TableCell key={cell.id}>{cell.info.header === 'Timestamp' ? formatDate(new Date(cell.value)) : cell.value}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </DataTable>
                </div>

                <Pagination
                    totalItems={filteredRows.length}
                    pageSize={rowsPerPage}
                    pageSizes={[5, 10, 15, 20, 25]}
                    onChange={({ page, pageSize }) => {
                        handlePageChange(page);
                        handleRowsPerPageChange({ target: { value: pageSize } });
                    }}
                />
            </div>
        </section>
    );
}

export default AuditLogs;
