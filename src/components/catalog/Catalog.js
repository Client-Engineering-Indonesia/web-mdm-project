import './Catalog.css';
import React from 'react';
import { Button, Search, Row, Dropdown, Grid, Tile, Column, Theme, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Checkbox } from '@carbon/react';
import axios from 'axios'; 
import { useState, useEffect } from 'react';
import { fetchToken } from '../../utils/utils';

const url = 'http://52.118.170.239:8443';
// const url = 'http://127.0.0.1:5000';

function Catalog() {
    const [catalogList, setCatalogList] = useState([]);

    useEffect(() => {
        const fetchCatalogList = async () => {
            try {
                var token = await fetchToken();
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                console.log(headers)
                const response = await axios.get(`${url}/get_catalogs`, { headers });

                if (response.status !== 200) {
                    throw new Error('Failed to fetch data');
                }
                
                setCatalogList(response.data.data); 
            } catch (error) {
                console.log(error)
                console.error('Error fetching data:', error.message);
            }
        };

        fetchCatalogList();
    }, []);

    const tableData = [
        {
            id: 0,
            table_name:'MASTER_TABLE_4',
            table_schema:'dbo',
            table_size:'18kb',
            total_column: 15
        },
        {
            id: 1,
            table_name:'MASTER_TABLE_5',
            table_schema:'dbo',
            table_size:'18kb',
            total_column: 10
        },
        {
            id: 2,
            table_name:'MASTER_TABLE_6',
            table_schema:'dbo',
            table_size:'18kb',
            total_column: 12
        },
        {
            id: 3,
            table_name:'TRANSACION_TABLE_1',
            table_schema:'dbo',
            table_size:'18kb',
            total_column: 16
        },
        {
            id: 4,
            table_name:'TRANSACION_TABLE_2',
            table_schema:'dbo',
            table_size:'18kb',
            total_column: 17
        }
    ];

    return (
        <Theme theme="white">
            <Grid>
                <Column lg={6} md={4} sm={2} className='column'>
                    <Tile className='db-tile' style={{marginBottom: '2rem'}}>
                        <div>
                            <Dropdown 
                                id="default" 
                                titleText="Catalog List" 
                                label="Choose catalog" 
                                items={catalogList} 
                                itemToString={item => item ? item.catalog_name : ''} 
                            />
                        </div>
                    </Tile>
                </Column>
                <Column lg={10} md={4} sm={2}>
                    <Tile className='table-tile'>
                            <p className='heading-text' style={{marginBottom: '2rem'}}>List of Tables</p>
                            <Grid>
                                <Column lg={5}></Column>
                                <Column lg={5}>
                                    <div className='search-div'>
                                        <Search 
                                        size="md" 
                                        placeholder="Search" 
                                        labelText="Search" closeButtonLabelText="Clear search input" id="search-1" onChange={() => {}} onKeyDown={() => {}} 
                                        />
                                    </div>
                                </Column>
                            </Grid>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableHeader>
                                            Table Name
                                        </TableHeader>
                                        <TableHeader>
                                            Table Schema
                                        </TableHeader>
                                        <TableHeader>
                                            Table Size
                                        </TableHeader>
                                        <TableHeader>
                                            Total Column
                                        </TableHeader>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map((item, index) => (
                                        <TableRow>
                                            <TableCell>
                                                {item.table_name}
                                            </TableCell>
                                            <TableCell>
                                                {item.table_schema}
                                            </TableCell>
                                            <TableCell>
                                                {item.table_size}
                                            </TableCell>
                                            <TableCell>
                                                {item.total_column}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                    </Tile>
                </Column>
            </Grid>
        </Theme>
    );
}

export default Catalog;