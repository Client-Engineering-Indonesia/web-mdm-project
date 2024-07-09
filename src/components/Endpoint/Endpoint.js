import './Endpoint.css'
import React from 'react';
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    Button, Search, Dropdown, IconButton, Pagination
} from '@carbon/react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import { Add, CopyFile, TrashCan, Edit, Power } from '@carbon/icons-react';


const headers = [
    {
        key: 'EndpointName',
        header: 'Endpoint Name',
    },
   {
        key: 'Status',
        header: 'Status',
   },
   {
        key: 'Engine',
        header: 'Engine',
    },
    {
        key: 'Hostname',
        header: 'Hostname',
    },
    {
        key: 'Port',
        header: 'Port',
    },
    {
        key: 'DatabaseName',
        header: 'Database Name',
    },
    {
        key: 'UserAcess',
        header: 'User Access',
    },
    {
        key: 'CreatedAt',
        header: 'Created At',
    },
    {
        key: 'Subscribed',
        header: 'Subscribed',
    }
];

const rows = [
    {
        id: 'a',
        EndpointName: 'Endpoint 1',
        Status: 'Active',
        Engine: 'Postgres',
        Hostname: 'localhost',
        Port: '5432',
        DatabaseName: 'db1',
        UserAcess: 'user1',
        CreatedAt: '2021-07-01',
        Subscribed: 'TRUE'
    },
    {
        id: 'b',
        EndpointName: 'Endpoint 2',
        Status: 'Active',
        Engine: 'Postgres',
        Hostname: 'localhost',
        Port: '5432',
        DatabaseName: 'db2',
        UserAcess: 'user2',
        CreatedAt: '2021-07-02',
        Subscribed: 'TRUE'
    },
    {
        id: 'c',
        EndpointName: 'Endpoint 3',
        Status: 'Active',
        Engine: 'Postgres',
        Hostname: 'localhost',
        Port: '5432',
        DatabaseName: 'db3',
        UserAcess: 'user3',
        CreatedAt: '2021-07-03',
        Subscribed: 'TRUE'
    },
    {
        id: 'd',
        EndpointName: 'Endpoint 4',
        Status: 'Active',
        Engine: 'Postgres',
        Hostname: 'localhost',
        Port: '5432',
        DatabaseName: 'db4',
        UserAcess: 'user4',
        CreatedAt: '2021-07-04',
        Subscribed: 'TRUE'
    },
    {
        id: 'e',
        EndpointName: 'Endpoint 5',
        Status: 'Active',
        Engine: 'Postgres',
        Hostname: 'localhost',
        Port: '5432',
        DatabaseName: 'db5',
        UserAcess: 'user5',
        CreatedAt: '2021-07-05',
        Subscribed: 'TRUE'
    },
];




function ENDPOINT() {
    return (
        <section className='endpoint'>

            <div className='endpoint-tab'>
                <Tabs>
                    <TabList aria-label="List of tabs">
                        <Tab>Internal</Tab>
                        <Tab>External</Tab>
                    </TabList>
                </Tabs>
            </div>

            <div className='endpoint-content'>
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
                            <IconButton label="edit" kind='secondary'>
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
                </div>

                <div className='endpoint-tables'>
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
                    <Pagination
                        backwardText="Previous page"
                        forwardText="Next page"
                        itemsPerPageText="Items per page:"
                        onChange={function noRefCheck() { }}
                        page={1}
                        pageSize={10}
                        pageSizes={[
                            10,
                            20,
                            30,
                            40,
                            50
                        ]}
                        size="md"
                        totalItems={103}
                    />
                </div>
            </div>
        </section>
    );
}

export default ENDPOINT;