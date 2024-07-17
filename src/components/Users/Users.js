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
import axios from 'axios';

const url = 'http://52.118.170.239:8443';

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
    const [selectedUserRole, setSelectedUserRole] = useState(null);
    const [userName, setUserName] = useState('');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSubmit = async () => {
        if (!userName || !selectedUserRole) {
            alert('Please fill in all required fields.');
            return;
        }

        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxMDAwMzMxMDIwIiwidXNlcm5hbWUiOiJhZG1pbl9idV9hIiwidXNlcl9lbWFpbCI6IiIsInJvbGUiOiJVc2VyIiwiYnVzaW5lc3NfdW5pdF9uYW1lIjoiQnVzaW5lc3MgVW5pdCBBIEdyb3VwIiwiYnVzaW5lc3NfdW5pdF9pZCI6MTAwMDEsImNwNGRfdG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSXNJbXRwWkNJNklsRTJNR1pYT0Y5SlkyeFJXRFJxU2xkNVdrRjNOMHBJWVZKbVRtUkJUbmhwTVVJeGJ6UTBiWHB0TlRnaWZRLmV5SjFjMlZ5Ym1GdFpTSTZJbUZrYldsdVgySjFYMkVpTENKeWIyeGxJam9pVlhObGNpSXNJbkJsY20xcGMzTnBiMjV6SWpwYkltRmpZMlZ6YzE5allYUmhiRzluSWl3aWRtbGxkMTluYjNabGNtNWhibU5sWDJGeWRHbG1ZV04wY3lJc0ltZHNiM056WVhKNVgyRmtiV2x1SWl3aVkzSmxZWFJsWDNOd1lXTmxJaXdpWTNKbFlYUmxYM0J5YjJwbFkzUWlMQ0prWVhSaFgzRjFZV3hwZEhsZlpISnBiR3hmWkc5M2JpSXNJbTFoYm1GblpWOWthWE5qYjNabGNua2lMQ0p0WVc1aFoyVmZZMkYwWVd4dlp5SXNJbUYxZEdodmNsOW5iM1psY201aGJtTmxYMkZ5ZEdsbVlXTjBjeUlzSW0xaGJtRm5aVjlrWVhSaFgzRjFZV3hwZEhsZmMyeGhYM0oxYkdWeklpd2lZV05qWlhOelgyUmhkR0ZmY1hWaGJHbDBlVjloYzNObGRGOTBlWEJsY3lJc0ltMWhibUZuWlY5emNHRmpaU0lzSW0xaGJtRm5aVjluYkc5emMyRnllU0lzSW0xaGJtRm5aVjlqWVhSbFoyOXlhV1Z6SWl3aVkyOXVabWxuZFhKbFgyRjFkR2dpTENKdFlXNWhaMlZmY0hKdmFtVmpkQ0lzSW0xaGJtRm5aVjluY205MWNITWlMQ0p0WVc1aFoyVmZkWE5sY25NaUxDSnRZVzVoWjJWZloyOTJaWEp1WVc1alpWOTNiM0pyWm14dmR5SXNJbTFsWVhOMWNtVmZaR0YwWVY5eGRXRnNhWFI1SWl3aWJXOXVhWFJ2Y2w5emNHRmpaU0lzSW0xdmJtbDBiM0pmY0hKdmFtVmpkQ0pkTENKbmNtOTFjSE1pT2xzeE1EQXdNU3d4TURBd01GMHNJbk4xWWlJNkltRmtiV2x1WDJKMVgyRWlMQ0pwYzNNaU9pSkxUazlZVTFOUElpd2lZWFZrSWpvaVJGTllJaXdpZFdsa0lqb2lNVEF3TURNek1UQXlNQ0lzSW1GMWRHaGxiblJwWTJGMGIzSWlPaUpsZUhSbGNtNWhiQ0lzSW1saGJTSTZleUpoWTJObGMzTlViMnRsYmlJNkluTm9ZVEkxTm41cFQzTTBOMFE1TTFwUVpVY3lRemRrUjFaVlpGY3diR0pCT1RaaGJEZzROazlHVFY5R056VkNjRk52SW4wc0ltUnBjM0JzWVhsZmJtRnRaU0k2SWtGa2JXbHVYMEpWWDBFaUxDSmhjR2xmY21WeGRXVnpkQ0k2Wm1Gc2MyVXNJbWxoZENJNk1UY3lNVEV4TWpJM09Dd2laWGh3SWpveE56SXhNVFUxTkRReWZRLk55bXdrVHNqUWdhaXJjRjlpa1VVNU01dWVMMG9DNF9POEVFb3g2akNXeGlsOF83b0dXUVY2a2dlcmVzWEhXbXdad3dacFZMR2FXWXp5dmZYelZmakFKdjhhWmdIeDBZREhYN0lySUw5aXlpdDBGNHdQcWJaaHFheW82RV9jRFFiWWduVmRzUjhLYTUxcWNJbm5ZbDdhaDRGcGxoR3c3REt4SzlibWVrZ05zVjBkODRyLUEwMXFGTVVnVDk1WnFib0NSaWpyMk12cWNCR2U5bzgtUThCYXZhZ1J3NzhjVURmeDgxTXd4RnJCTkEtTG1yQ2NoMTFmaHczemhZMzhoNmN0V1pnQl9TQW8tRmE0YVVyNXREOXJoNmh0Sl9lMTVRWFo3b3c1S3VzNkpBa21jVjFqQ2dGaVZQOTAyYjVJWEZSNnNNd2ZtcjhoaEtnRzhnTktSM2dhdyIsImV4cCI6MTcyMTEzMDI3OX0.9qlEX9-WJbpwlPd69XrBb-Z3YFjbX5PABziiGpruar0'; //HARDCODE

        const payload = {
            user_roles: [selectedUserRole.id],
            web_token: token,
        };

        try {
            const response = await axios.put(`${url}/assign_role/${userName}`, payload);
            if (response.status === 200) {
                alert('Role assigned successfully');
            } else {
                alert('Failed to assign role');
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        }
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
                    <TextInput
                        id="userName"
                        labelText="User Name"
                        placeholder="Enter User Name"
                        className='input-text'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <Dropdown
                        id="userRoles"
                        label="User Roles"
                        items={userRoles}
                        itemToString={item => (item ? item.text : '')}
                        onChange={({ selectedItem }) => setSelectedUserRole(selectedItem)}
                        placeholder="Select User Roles"
                        style={{ margin: '1rem 0rem' }}
                    />
                    <div className='button-container'>
                        <Button kind="primary" onClick={handleSubmit} style={{ width: '50%' }}>Submit</Button>
                        <Button kind="secondary" onClick={toggleSidebar} style={{ width: '50%' }}>Cancel</Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default USERS;