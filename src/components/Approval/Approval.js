import React, { useState, useEffect } from 'react';
import {
    DataTable,
    TableContainer,
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    Modal,
    FormGroup,
    TextInput,
    Search,
    Pagination
} from '@carbon/react';
import { CheckmarkOutline, MisuseOutline, View } from '@carbon/icons-react';
import axios from 'axios';
import './Approval.css';

const headersPending = [
    { key: 'businessUnit', header: 'Business Unit' },
    { key: 'datasetName', header: 'Dataset Name' },
    { key: 'databaseName', header: 'Database Name' },
    { key: 'tableName', header: 'Table Name' },
    { key: 'requestor', header: 'Requestor' },
    { key: 'requestTimestamp', header: 'Request Timestamp' },
    { key: 'role', header: 'Role' },
    { key: 'duration', header: 'Duration' },
    { key: 'type', header: 'Type' },
];

const headersActive = [
    { key: 'businessUnit', header: 'Business Unit' },
    { key: 'datasetName', header: 'Dataset Name' },
    { key: 'databaseName', header: 'Database Name' },
    { key: 'tableName', header: 'Table Name' },
    { key: 'requestor', header: 'Requestor' },
    { key: 'requestTimestamp', header: 'Request Timestamp' },
    { key: 'status', header: 'Status' },
    { key: 'approvedTimestamp', header: 'Approved Timestamp' },
    { key: 'expireDate', header: 'Expire Date' },
];

// const datas = [
//     {
//         id: '1',
//         businessUnit: 'Business Unit 2',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_2',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '15',
//         type: 'Subscribe',
//         status: 'Pending',
//         approvedTimestamp: null,
//         expireDate: null,
//     },
//     {
//         id: '2',
//         businessUnit: 'Business Unit 3',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_3',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '60',
//         type: 'Subscribe',
//         status: 'Pending',
//         approvedTimestamp: null,
//         expireDate: null,
//     },
//     {
//         id: '3',
//         businessUnit: 'Business Unit 4',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_4',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '7',
//         type: 'Subscribe',
//         status: 'Pending',
//         approvedTimestamp: null,
//         expireDate: null,
//     },
//     {
//         id: '4',
//         businessUnit: 'Business Unit 5',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_ORA_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_5',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '30',
//         type: 'Subscribe',
//         status: 'Pending',
//         approvedTimestamp: null,
//         expireDate: null,
//     },
//     {
//         id: '5',
//         businessUnit: 'Business Unit 1',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'SPV_BU_1',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '15',
//         type: 'Publish',
//         status: 'Pending',
//         approvedTimestamp: null,
//         expireDate: null,
//     },
//     {
//         id: '6',
//         businessUnit: 'Business Unit 1',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'SPV_BU_1',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '15',
//         type: 'Publish',
//         status: 'Pending',
//         approvedTimestamp: null,
//         expireDate: null,
//     },
//     {
//         id: '7',
//         businessUnit: 'Business Unit 2',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_2',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '15',
//         type: 'Subscribe',
//         status: 'Active',
//         approvedTimestamp: '2024-01-01 00:00:00',
//         expireDate: '9999-12-31',
//     },
//     {
//         id: '8',
//         businessUnit: 'Business Unit 3',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_3',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '60',
//         type: 'Subscribe',
//         status: 'Active',
//         approvedTimestamp: '2024-01-01 00:00:00',
//         expireDate: '9999-12-31',
//     },
//     {
//         id: '9',
//         businessUnit: 'Business Unit 4',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_4',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '7',
//         type: 'Subscribe',
//         status: 'Active',
//         approvedTimestamp: '2024-01-01 00:00:00',
//         expireDate: '9999-12-31',
//     },
//     {
//         id: '10',
//         businessUnit: 'Business Unit 5',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_ORA_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_5',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '30',
//         type: 'Subscribe',
//         status: 'Active',
//         approvedTimestamp: '2024-01-01 00:00:00',
//         expireDate: '9999-12-31',
//     },
//     {
//         id: '11',
//         businessUnit: 'Business Unit 6',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_6',
//         requestTimestamp: '2024-01-01 00:00:00',
//         role: 'Viewer',
//         duration: '15',
//         type: 'Publish',
//         status: 'Expired',
//         approvedTimestamp: '2024-01-01 00:00:00',
//         expireDate: '2024-01-01',
//     },
// ];

// const rowsActive = [
//     {
//         id: '1',
//         businessUnit: 'Business Unit 2',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_2',
//         requestTimestamp: '2024-01-01 00:00:00',
//         status: 'Active',
//         approvedTimestamp: '2024-01-01 00:00:00',
//         expireDate: '9999-12-31',
//     },
//     {
//         id: '2',
//         businessUnit: 'Business Unit 3',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_3',
//         requestTimestamp: '2024-01-01 00:00:00',
//         status: 'Active',
//         approvedTimestamp: '2024-01-01 00:00:00',
//         expireDate: '9999-12-31',
//     },
//     {
//         id: '3',
//         businessUnit: 'Business Unit 4',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_MSSQL_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_4',
//         requestTimestamp: '2024-01-01 00:00:00',
//         status: 'Active',
//         approvedTimestamp: '2024-01-01 00:00:00',
//         expireDate: '9999-12-31',
//     },
//     {
//         id: '4',
//         businessUnit: 'Business Unit 5',
//         datasetName: 'TRANSACTIONSET',
//         databaseName: 'DB_ORA_1',
//         tableName: 'TRANSACTION_TABLE_1',
//         requestor: 'MGR_BU_5',
//         requestTimestamp: '2024-01-01 00:00:00',
//         status: 'Active',
//         approvedTimestamp: '2024-01-01 00:00:00',
//         expireDate: '9999-12-31',
//     },
// {
//     id: '5',
//     businessUnit: 'Business Unit 6',
//     datasetName: 'TRANSACTIONSET',
//     databaseName: 'DB_MSSQL_1',
//     tableName: 'TRANSACTION_TABLE_1',
//     requestor: 'MGR_BU_6',
//     requestTimestamp: '2024-01-01 00:00:00',
//     status: 'Expired',
//     approvedTimestamp: '2024-01-01 00:00:00',
//     expireDate: '2024-01-01',
// },
// ];

// const rowsPending = datas.filter(f => f.status == 'Pending');
// const rowsActive = datas.filter(f => f.status !== 'Pending');

const Approval = () => {

    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [datas, setDatas] = useState([]);
    const [filteredPendingRows, setFilteredPendingRows] = useState([]);
    const [filteredActiveRows, setFilteredActiveRows] = useState([]);
    const [searchInputPending, setSearchInputPending] = useState('');
    const [searchInputActive, setSearchInputActive] = useState('');
    const [pagePending, setPagePending] = useState(1);
    const [pageActive, setPageActive] = useState(1);

    const itemsPerPage = 5;


    // Define fetchData function
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/get_approval_data');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log('fetch data', data);

            // Update state with fetched data
            setDatas(data);

            // Filter rows based on status
            const rowsPending = data.filter(f => f.status === 'Pending');
            const rowsActive = data.filter(f => f.status !== 'Pending');
            setFilteredPendingRows(rowsPending);
            setFilteredActiveRows(rowsActive);
        } catch (error) {
            console.log('error', error);
        }
    };

    // Call fetchData in useEffect
    useEffect(() => {
        fetchData();
    }, []);


    const handleActionClick = (row, action) => {
        if (action === 'approve' || action === 'reject') {
            const confirmMessage = action === 'approve' ? 'Approve this request?' : 'Reject this request?';
            if (window.confirm(confirmMessage)) {
                const newStatus = action === 'approve' ? 'Active' : 'Rejected';

                axios.put(`http://localhost:5000/update_approval_status/${row.id}`, { status: newStatus })
                    .then(response => {
                        console.log(`${action} request`, response.data.message);
                        fetchData();
                    })
                    .catch(error => {
                        if (error.response) {
                            console.error('Error:', error.response.data.error);
                        } else {
                            console.error('Error:', error.message);
                        }
                    });
            }
        } else if (action === 'show') {
            setSelectedRow(row);
            setOpen(true);
        }
    };

    const handleSearchPending = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchInputPending(value);

        const filteredPending = datas.filter(row =>
            row.status === 'Pending' &&
            Object.values(row).some(cellValue =>
                String(cellValue).toLowerCase().includes(value)
            )
        );
        setFilteredPendingRows(filteredPending);
        setPagePending(1);
    };

    const handleSearchActive = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchInputActive(value);

        const filteredActive = datas.filter(row =>
            row.status !== 'Pending' &&
            Object.values(row).some(cellValue =>
                String(cellValue).toLowerCase().includes(value)
            )
        );
        setFilteredActiveRows(filteredActive);
        setPageActive(1);
    };

    const handlePageChangePending = (event) => {
        setPagePending(event.page);
    };

    const handlePageChangeActive = (event) => {
        setPageActive(event.page);
    };

    const paginatedPendingRows = filteredPendingRows.slice(
        (pagePending - 1) * itemsPerPage,
        pagePending * itemsPerPage
    );

    const paginatedActiveRows = filteredActiveRows.slice(
        (pageActive - 1) * itemsPerPage,
        pageActive * itemsPerPage
    );

    const renderFormFields = () => {
        console.log('selected Row', selectedRow);
        if (!selectedRow) return null;

        const isPending = selectedRow.cells.some(cell => cell.info.header === 'Role');

        return (
            <FormGroup legendText="">
                {selectedRow.cells.map(cell => (
                    <TextInput
                        key={cell.id}
                        id={cell.id}
                        labelText={cell.info.header}
                        value={cell.value}
                        readOnly
                    />
                ))}
            </FormGroup>
        );
    };

    return (
        <div>
            <div >
                <div className="pending-container">
                    <div className='options'>
                        <div className='title'>
                            PENDING APPROVAL
                        </div>
                        <div className='search'>
                            <Search
                                className='search-bar'
                                size="lg"
                                placeholder="Search"
                                labelText="Search"
                                closeButtonLabelText="Clear search input"
                                id="search-pending"
                                value={searchInputPending}
                                onChange={handleSearchPending}
                                onKeyDown={handleSearchPending}
                            />
                        </div>
                    </div>

                    <DataTable rows={paginatedPendingRows} headers={headersPending}>
                        {({ rows, headers, getHeaderProps, getRowProps }) => (
                            <TableContainer className="table-container">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {headers.map(header => (
                                                <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                                            ))}
                                            <TableHeader>Action</TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map(row => (
                                            <TableRow {...getRowProps({ row })} key={row.id}>
                                                {row.cells.map(cell => (
                                                    <TableCell key={cell.id}>{cell.value}</TableCell>
                                                ))}

                                                <TableCell>
                                                    <CheckmarkOutline
                                                        onClick={() => handleActionClick(row, 'approve')}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    <MisuseOutline
                                                        onClick={() => handleActionClick(row, 'reject')}
                                                        style={{ cursor: 'pointer', marginLeft: 5 }}
                                                    />
                                                    <View
                                                        onClick={() => handleActionClick(row, 'show')}
                                                        style={{ cursor: 'pointer', marginLeft: 5 }}
                                                    />
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Pagination
                                    totalItems={filteredPendingRows.length}
                                    pageSize={itemsPerPage}
                                    pageSizes={[5, 10, 15, 20, 25]}
                                    page={pagePending}
                                    onChange={handlePageChangePending}
                                />
                            </TableContainer>
                        )}
                    </DataTable>
                </div>
                <div className="approval-container">

                    <div className='options'>
                        <div className='title'>
                            ACTIVE SUBSCRIPTION
                        </div>
                        <div className='search'>
                            <Search
                                className='search-bar'
                                size="lg"
                                placeholder="Search"
                                labelText="Search"
                                closeButtonLabelText="Clear search input"
                                id="search-active"
                                value={searchInputActive}
                                onChange={handleSearchActive}
                                onKeyDown={handleSearchActive}
                            />
                        </div>
                    </div>

                    <DataTable rows={paginatedActiveRows} headers={headersActive}>
                        {({ rows, headers, getHeaderProps, getRowProps }) => (
                            <TableContainer className="table-container">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {headers.map(header => (
                                                <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                                            ))}
                                            <TableHeader>Action</TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map(row => (
                                            <TableRow {...getRowProps({ row })} key={row.id}>
                                                {row.cells.map(cell => (
                                                    <TableCell key={cell.id}>{cell.value}</TableCell>
                                                ))}
                                                <TableCell>
                                                    {/* <Button size="small" onClick={() => handleActionClick(row, 'show')}>Show</Button> */}
                                                    <View
                                                        onClick={() => handleActionClick(row, 'show')}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Pagination
                                    totalItems={filteredActiveRows.length}
                                    pageSize={itemsPerPage}
                                    pageSizes={[5, 10, 15, 20]}
                                    page={pageActive}
                                    onChange={handlePageChangeActive}
                                />
                            </TableContainer>
                        )}
                    </DataTable>
                </div>
            </div>
            <Modal
                open={open}
                onRequestClose={() => setOpen(false)}
                modalHeading="Approval Details"
                primaryButtonText="Close"
                secondaryButtonText="Cancel"
                onRequestSubmit={() => setOpen(false)}
            >
                {renderFormFields()}
            </Modal>
        </div>
    );
};

export default Approval;
