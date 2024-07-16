import './Users.css';
import React, { useState } from 'react';
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    IconButton,
    Search,
    TextInput,
    Button,
    Dropdown,
} from '@carbon/react';

import { Add, CopyFile, TrashCan, Edit, Power, Close } from '@carbon/icons-react';
const url = 'http://52.118.170.239:8443';
// const url = 'http://52.118.170.239:8443';

const headers = [
    { key: 'BusinessUnit', header: 'Business Unit' },
    { key: 'UserName', header: 'User Name' },
    { key: 'Email', header: 'Email' },
    { key: 'UserGroup', header: 'User Group' },
    { key: 'Role', header: 'Role' },
    { key: 'FullName', header: 'Full Name' },
    { key: 'LastLogin', header: 'Last Login' },
    { key: 'CreatedDate', header: 'Created Date' },
    { key: 'ValidUntil', header: 'Valid Until' },
    { key: 'IsActive', header: 'Is Active' },
];

const rows = [
    {
        id: 'a',
        BusinessUnit: 'Business Unit 1',
        UserName: 'svc_adm_1',
        Email: 'svc_adm_1@BU_1.com',
        UserGroup: 'ADM_GRP',
        Role: 'Admin',
        FullName: 'Administrator',
        LastLogin: '2024-01-01 00:00',
        CreatedDate: '2024-01-01',
        ValidUntil: '9999-12-31',
        IsActive: 'TRUE',
    },
];

const businessUnits = [
    { id: '1', text: 'Business Unit 1' },
    { id: '2', text: 'Business Unit 2' },
];

const userGroups = [
    { id: '1', text: 'VM-GRP' },
    { id: '2', text: 'MGR-GRP' },
];

const userRoles = [
    { id: '6b7565ce-1b88-406c-a6c0-b8a648212cdd', text: 'Business Unit User' },
    { id: 'f63304ee-7d58-4bd0-844e-6ecb307e1975', text: 'Business Unit Steward' },
    { id: '3757020c-d282-4706-a96f-a5255048b46c', text: 'Admin Business Unit' }
]
function USERS() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(null);
    const [selectedUserGroup, setSelectedUserGroup] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <section className='users'>
            <div className='users-content'>
                <div className='title'>
                    <p>USERS</p>
                </div>

                <div className='options'>
                    <div className='menus'>
                        <div className='menu-name-images'>
                            <IconButton label="add">
                                <Add className='button-add' />
                            </IconButton>
                            <p>Add</p>
                        </div>
                        <div className='menu-name-images'>
                            <IconButton label="duplicate" kind='secondary'>
                                <CopyFile className='button-duplicate' />
                            </IconButton>
                            <p>Duplicate</p>
                        </div>
                        <div className='menu-name-images'>
                            <IconButton label="edit" kind='secondary' onClick={toggleSidebar}>
                                <Edit className='button-edit' />
                            </IconButton>
                            <p>Edit</p>
                        </div>
                        <div className='menu-name-images'>
                            <IconButton label="delete" kind='secondary'>
                                <TrashCan className='button-delete' />
                            </IconButton>
                            <p>Delete</p>
                        </div>
                        <div className='menu-name-images'>
                            <IconButton label="activate" kind='secondary'>
                                <Power className='button-activate' />
                            </IconButton>
                            <p>Activate</p>
                        </div>
                    </div>
                    <div className='search'>
                        <Search
                            size="lg"
                            placeholder="Search"
                            labelText="Search"
                            closeButtonLabelText="Clear search input"
                            id="search-1"
                            onChange={() => { }}
                            onKeyDown={() => { }}
                        />
                    </div>
                </div>

                <div className='users-tables'>
                    <DataTable rows={rows} headers={headers}>
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
                                                <TableCell key={cell.id}>{cell.value}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </DataTable>
                </div>
            </div>

            <div className={`edit-sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <IconButton
                    label="Close"
                    onClick={toggleSidebar}
                    className="close-button"
                >
                    <Close />
                </IconButton>
                <h3 style={{ marginBottom: '1rem' }}>Edit User</h3>
                <form>
                    <Dropdown
                        id="businessUnit"
                        label="Business Unit"
                        items={businessUnits}
                        itemToString={item => (item ? item.text : '')}
                        onChange={({ selectedItem }) => setSelectedBusinessUnit(selectedItem)}
                        placeholder="Select Business Unit"
                        style={{ marginBottom: '1.5rem' }}
                    />
                    <TextInput id="userName" labelText="User Name" placeholder="Enter User Name" className='input-text' />

                    <Dropdown
                        id="userRoles"
                        label="User Roles"
                        items={userRoles}
                        itemToString={item => (item ? item.text : '')}
                        onChange={({ selectedItem }) => setSelectedUserGroup(selectedItem)}
                        placeholder="Select User Roles"
                        style={{ margin: '1rem 0rem' }}

                    />
                    <div className='button-container'>
                        <Button kind="primary" onClick={() => { }} style={{ width: '50%' }}>Submit</Button>
                        <Button kind="secondary" onClick={toggleSidebar} style={{ width: '50%' }}>Cancel</Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default USERS;