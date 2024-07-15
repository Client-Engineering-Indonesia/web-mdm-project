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
import Cookies from 'js-cookie';

const headers = [
    { key: 'is_approved', header: 'Status' },
    { key: 'requestor_business_unit', header: 'Business Unit' },
    { key: 'requestor_username', header: 'UserName' },
    { key: 'requestor_role', header: 'Role' },
    { key: 'table_name', header: 'Table Name' },
    { key: 'table_schema', header: 'Table Schema' },
    // { key: 'owner_email', header: 'Email' },
    // { key: 'owner_name', header: 'Name' },
    // { key: 'owner_phone', header: 'Phone' },
    { key: 'description', header: 'Description' },
    { key: 'request_timestamp', header: 'Request Timestamp' },
    { key: 'approved_timestamp', header: 'Approved Timestamp' },
    { key: 'expire_date', header: 'Expire Date' }
];

const url = 'http://52.118.170.239:8443';
// const url = 'http://52.118.170.239:8443';

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
            const response = await fetch(`${url}/get_approval_data`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log('fetch data', data);

            // Update state with fetched data
            setDatas(data);

            // Filter rows based on status
            const rowsPending = data.filter(f => f.is_approved === false);
            const rowsActive = data.filter(f => f.is_approved === true);
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
                const newStatus = action === 'approve' ? true : false;
                const webToken = Cookies.get('web_token');
                var body = {
                    status: newStatus,
                    table_name: row.table_name,
                    table_schema: row.table_schema,
                    webtoken: webToken
                }

                axios.put(`${url}/update_approval_status/${row.id}`, body)
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
            row.is_approved === null &&
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
            row.is_approved !== null &&
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

    const renderApprovalStatus = (row) => {
        if (row.cells[0].value === null) return 'Pending';
        return row.cells[0].value ? 'Approved' : 'Rejected';
    };

    const renderFormFields = () => {
        // console.log('selected Row', selectedRow);
        if (!selectedRow) return null;

        const getHeaderLabel = (key) => {
            const header = headers.find(header => header.key === key);
            return header ? header.header : key;
        };

        const getFormattedValue = (key, value) => {
            if (key === 'is_approved') {
                if (value === null) return 'Pending';
                return value ? 'Approved' : 'Rejected';
            }
            return value;
        };

        return (
            <FormGroup legendText="">
                {selectedRow.cells.map(cell => (
                    <TextInput
                        key={cell.id}
                        id={cell.id}
                        labelText={getHeaderLabel(cell.info.header)}
                        value={getFormattedValue(cell.info.header, cell.value)}
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

                    <DataTable rows={paginatedPendingRows} headers={headers}>
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
                                                    <TableCell key={cell.id}>
                                                        {cell.id.includes('is_approved')
                                                            ? renderApprovalStatus(row)
                                                            : cell.value}
                                                    </TableCell>
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

                    <DataTable rows={paginatedActiveRows} headers={headers}>
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
                                                    <TableCell key={cell.id}>
                                                        {cell.id.includes('is_approved')
                                                            ? renderApprovalStatus(row)
                                                            : cell.value}
                                                    </TableCell>
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
