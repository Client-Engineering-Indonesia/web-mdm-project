import './Roles.css';
import React, { useState, useEffect } from 'react';
import { IconButton, Search, Row, Dropdown, Grid, Tile, Column, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
import axios from 'axios';
import { Add, TrashCan, Power } from '@carbon/icons-react';

const url1 = 'http://';
const url2 = 'http://127.0.0.1:5000';

function Roles() {
    const [data, setData] = useState([]); // Initialize state as an empty array
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const getToken = async () => {
        try {
            const response = await axios.post(`${url2}/get_token`);
            return response.data.token; // Adjust this according to your API response structure
        } catch (error) {
            console.error('Error fetching token:', error);
            throw error;
        }
    };

    const fetchData = async () => {
        try {
            const token = await getToken();
            const requestHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`${url2}/get_roles`, { headers: requestHeaders });
            setData(response.data.data); // Ensure this matches the structure of your API response
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { key: 'role_name', header: 'Role Name' },
        { key: 'role_description', header: 'Role Description' },
        { key: 'updated_at', header: 'Updated Date' },
        { key: 'permissions', header: 'Permissions' }
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    return (
        <section className='roles' >
            {/* crud roles */}
            <section className='crud-roles'>
                {/* title */}
                <div className='title-and-action'>
                    <p className='title'>Roles</p>
                    <div className='action'>
                        <div className='action-role'>
                            <IconButton label="add" kind='secondary'>
                                <Add className='button-add' />
                            </IconButton>
                            <p>Add</p>
                        </div>
                        <div className='action-role'>
                            <IconButton label="delete" kind='secondary'>
                                <TrashCan className='button-delete' />
                            </IconButton>
                            <p>Delete</p>
                        </div>
                        <div className='action-role'>
                            <IconButton label="activate" kind='secondary'>
                                <Power className='button-activate' />
                            </IconButton>
                            <p>Activate</p>
                        </div>
                    </div>
                </div>
                {/* title */}

                {/* content table */}
                <div className="container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((header) => (
                                    <TableHeader key={header.key} style={{ width: 400 }}>
                                        {header.header}
                                    </TableHeader>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(data) && data.map((row) => (
                                <TableRow key={row.role_name}>
                                    <TableCell>{row.role_name}</TableCell>
                                    <TableCell>{row.role_description}</TableCell>
                                    <TableCell>{row.updated_at}</TableCell>
                                    <TableCell>{row.permissions.join(', ')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* content table */}
            </section>
            {/* crud roles */}
        </section>
    );
}

export default Roles;
