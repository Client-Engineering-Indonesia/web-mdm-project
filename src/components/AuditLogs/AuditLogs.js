import React, { useState, useEffect } from 'react';
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
import './AuditLogs.css';
import fileData from './combined-dv-log-final.out';

const headers = [
    { key: 'Timestamp', header: 'Timestamp' , width: '175px'},
    { key: 'Interface', header: 'Interface' , width: '300px'},
    { key: 'UserName', header: 'UserName', width: '75px' },
    { key: 'UserGroup', header: 'UserGroup' , width: '75px'},
    { key: 'Role', header: 'Role' , width: '75px'},
    { key: 'Activity', header: 'Activity' , width: '150px'},
    { key: 'Message', header: 'Message' , width: '700px'},
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
    const [initData, setInitData] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    useEffect(() => {
        // Function to fetch and process the file content
        const fetchLogFile = async () => {
            try {
                const response = await fetch(fileData); // Fetch the imported file (can be replaced with Axios or other fetch methods)
                const text = await response.text();

                // console.log('text', text)

                const parsedData = parseFileContent(text); // Assuming parseFileContent is correctly defined
                setFilteredRows(parsedData);
                setInitData(parsedData);
            } catch (error) {
                console.error('Error fetching or parsing log file:', error);
            }
        };

        fetchLogFile();
    }, []);


    const parseFileContent = (logData) => {
        const logEntries = logData.split('\r\n');

        // Regex pattern to extract JSON string
        const pattern = /records: (.*)/;

        const jsonObjects = [];

        logEntries.forEach((entry) => {
            const match = pattern.exec(entry);
            if (match) {
                const jsonStr = match[1];

                const logEntry = JSON.parse(jsonStr);

                const newObject = {
                    id: logEntry.id.split(':').pop(),
                    Timestamp: logEntry.eventTime,
                    Activity: logEntry.observer?.name || '',
                    UserName: logEntry.initiator?.id || '',
                    UserGroup: logEntry.initiator?.typeURI?.split('/').pop() || '',
                    Role: logEntry.initiator?.typeURI?.split('/').pop() || '',
                    Message: logEntry.attachments?.[0]?.message || '',
                    Interface: logEntry.action
                };

                jsonObjects.push(newObject);
            }
        });

        return jsonObjects;
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchInput(value);
        const filtered = initData.filter((row) =>
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

            <DataTable rows={paginatedRows} headers={headers} style={{ width: '900px' }}>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <Table {...getTableProps()}>
                        <TableHead>
                            <TableRow>
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })} style={{ width: header.width }}>
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
    );
}

export default AuditLogs;
