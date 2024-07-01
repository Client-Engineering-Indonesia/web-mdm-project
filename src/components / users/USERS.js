import './USERS.css'
import React from 'react';
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    Button, Search, Dropdown, IconButton
} from '@carbon/react';
import { Add, CopyFile, TrashCan, Edit, Power } from '@carbon/icons-react';


const headers = [
    {
        key: 'BusinessUnit',
        header: 'Business Unit',
    },
    {
        key: 'UserName',
        header: 'User Name',
    },
    {
        key: 'Email',
        header: 'Email',
    },
    {
        key: 'UserGroup',
        header: 'User Group',
    },
    {
        key: 'Role',
        header: 'Role',
    },
    {
        key: 'FullName',
        header: 'Full Name',
    },
    {
        key: 'LastLogin',
        header: 'Last Login',
    },
    {
        key: 'CreatedDate',
        header: 'Created Date',
    },
    {
        key: 'ValidUntil',
        header: 'Valid Until',
    },
    {
        key: 'IsActive',
        header: 'Is Active',
    },
];

const rows = [
    {
        id: 'a',
        BusinessUnit: 'Business Unit 1',
        UserName: 'user_name_1',
        Email: 'Bambank@ibm.com',
        UserGroup: 'User Group 1',
        Role: 'Role 1',
        FullName: 'Full Name 1',
        LastLogin: 'Last Login 1',
        CreatedDate: 'Created Date 1',
        ValidUntil: 'Valid Until 1',
        IsActive: 'Active',
    },
    {
        id: 'b',
        BusinessUnit: 'Business Unit 1',
        UserName: 'user_name_1',
        Email: 'Syarifudin@ibm.com',
        UserGroup: 'User Group 1',
        Role: 'Role 1',
        FullName: 'Full Name 1',
        LastLogin: 'Last Login 1',
        CreatedDate: 'Created Date 1',
        ValidUntil: 'Valid Until 1',
        IsActive: 'Active',
    },
    {
        id: 'c',
        BusinessUnit: 'Business Unit 1',
        UserName: 'user_name_1',
        Email: 'moreno@ibm.com',
        UserGroup: 'User Group 1',
        Role: 'Role 1',
        FullName: 'Full Name 1',
        LastLogin: 'Last Login 1',
        CreatedDate: 'Created Date 1',
        ValidUntil: 'Valid Until 1',
        IsActive: 'Active',
    },
    {
        id: 'd',
        BusinessUnit: 'Business Unit 1',
        UserName: 'user_name_1',
        Email: 'farul@ibm.com',
        UserGroup: 'User Group 1',
        Role: 'Role 1',
        FullName: 'Full Name 1',
        LastLogin: 'Last Login 1',
        CreatedDate: 'Created Date 1',
        ValidUntil: 'Valid Until 1',
        IsActive: 'Active',
    },
];




function USERS() {
    return (
        <section className='users'>
            <div className='users-content'>
                <div className='title'>
                    <p>USERS</p>
                </div>

                <div className='options'>
                    <div className='menus'>
                        <div className='menu-name-images'>
                            <IconButton label="label">
                                <Add className='button-add' />
                            </IconButton>
                            <p>Add</p>
                        </div>
                        <div className='menu-name-images'>
                            <IconButton label="label">
                                <CopyFile className='button-duplicate' />
                            </IconButton>
                            <p>Duplicate</p>
                        </div>
                        <div className='menu-name-images'>
                            <IconButton label="label">
                                <Edit className='button-edit' />
                            </IconButton>
                            <p>Edit</p>
                        </div>
                        <div className='menu-name-images'>
                            <IconButton label="label">
                                <TrashCan className='button-delete' />
                            </IconButton>
                            <p>Delete</p>
                        </div>
                        <div className='menu-name-images'>
                            <IconButton label="label">
                                <Power className='button-activate' />
                            </IconButton>
                            <p>Activate</p>
                        </div>
                    </div>
                    <div className='search'>
                        <Search className='search-bar' size="lg" placeholder="Search" labelText="Search" closeButtonLabelText="Clear search input" id="search-1" onChange={() => { }} onKeyDown={() => { }} />
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
        </section>
    );
}

export default USERS;