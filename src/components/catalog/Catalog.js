import './Catalog.css';
import React from 'react';
import { Button, Search, Row, Dropdown, Grid, Tile, Column, Theme, RadioButton, RadioButtonGroup, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Checkbox } from '@carbon/react';
import axios from 'axios'; // Import Axios
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const url1 = 'http://52.118.170.239:8443';
const url2 = 'http://127.0.0.1:5000'

function Catalog() {
    const dbName = [
        {
            id: 'option-0',
            text: 'DB_MSSQL_1',
            tagId: '1'
        }
    ];

    const schemaName = [
        {
            id: 'option-0',
            text: 'dbo'
        }
    ];

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

    const listTable = [
        {
            id: '0',
            text: 'MASTER_TABLE_1',
        },
        {
            id: '1',
            text: 'MASTER_TABLE_2',
        },
        {
            id: '2',
            text: 'MASTER_TABLE_3',
        },
        {
            id: '3',
            text: 'TRANSACTION_TABLE_3',
        }
    ]

    const columnTableData = [
        {
            id: 1,
            column_name:'COLUMN_1',
            type:'VARCHAR',
            length:'100',
            precision: 0,
            scale: 0
        },
        {
            id: 2,
            column_name:'COLUMN_2',
            type:'VARCHAR',
            length:'100',
            precision: 0,
            scale: 0
        },
        {
            id: 3,
            column_name:'COLUMN_3',
            type:'VARCHAR',
            length:'100',
            precision: 0,
            scale: 0
        },
        {
            id: 4,
            column_name:'COLUMN_4',
            type:'VARCHAR',
            length:'100',
            precision: 0,
            scale: 0
        },
        {
            id: 5,
            column_name:'COLUMN_5',
            type:'VARCHAR',
            length:'100',
            precision: 0,
            scale: 0
        },
        {
            id: 6,
            column_name:'COLUMN_6',
            type:'VARCHAR',
            length:'100',
            precision: 0,
            scale: 0
        },
        {
            id: 7,
            column_name:'COLUMN_7',
            type:'VARCHAR',
            length:'100',
            precision: 0,
            scale: 0
        },
        {
            id: 8,
            column_name:'COLUMN_8',
            type:'VARCHAR',
            length:'100',
            precision: 0,
            scale: 0
        },
        {
            id: 9,
            column_name:'COLUMN_9',
            type:'VARCHAR',
            length:'100',
            precision: 0,
            scale: 0
        },
        {
            id: 10,
            column_name:'COLUMN_10',
            type:'VARCHAR',
            length:'100',
            precision: 0,
            scale: 0
        },
    ];

    return (
        <Theme theme="white">
            <Grid>
                <Column lg={6} md={4} sm={2} className='column'>
                    <Tile className='db-tile' style={{marginBottom: '2rem'}}>
                        <div>
                            <Dropdown 
                                id="default" 
                                titleText="Database Name" 
                                label="Choose database name" 
                                items={dbName} 
                                itemToString={item => item ? item.text : ''} 
                            />
                        </div>
                        <div style={{marginTop: '2rem'}}>
                            <Dropdown 
                                id="default" 
                                titleText="Schema Name" 
                                label="Choose schema name" 
                                items={schemaName} 
                                itemToString={item => item ? item.text : ''} 
                            />
                        </div>
                        
                    </Tile>
                    <Tile className='db-tile'>
                        <p className='heading-text'>Object Type</p>
                        <div>
                        <RadioButtonGroup name="radio-button-vertical-group" defaultSelected="radio-1" orientation="vertical">
                            <RadioButton labelText="Tables" value="radio-1" id="radio-1" />
                            <RadioButton labelText="View" value="radio-2" id="radio-2" />
                        </RadioButtonGroup>
                        </div>
                    </Tile>
                </Column>
                <Column lg={10} md={4} sm={2} className='column'>
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
            <Grid>
                <Column lg={16}>
                    <Tile className='column-editor-tile'>
                        <Grid>
                        <Column lg={3}>
                            <Tile>
                                {listTable.map((item, idx) => (
                                    <p>{item.text}</p>
                                ))}
                            </Tile>
                        </Column>
                        <Column lg={13}>
                            <div style={{marginTop: '1rem', marginRight: '1.5rem'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeader>
                                                Column Name
                                            </TableHeader>
                                            <TableHeader>
                                                Type
                                            </TableHeader>
                                            <TableHeader>
                                                Length
                                            </TableHeader>
                                            <TableHeader>
                                                Precision
                                            </TableHeader>
                                            <TableHeader>
                                                Scale
                                            </TableHeader>
                                            <TableHeader>
                                                Nullable
                                            </TableHeader>
                                            <TableHeader>
                                                Sensitive
                                            </TableHeader>
                                            <TableHeader>
                                                Enabled
                                            </TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {columnTableData.map((item, index) => (
                                            <TableRow>
                                                <TableCell>
                                                    {item.column_name}
                                                </TableCell>
                                                <TableCell>
                                                    {item.type}
                                                </TableCell>
                                                <TableCell>
                                                    {item.length}
                                                </TableCell>
                                                <TableCell>
                                                    {item.precision}
                                                </TableCell>
                                                <TableCell>
                                                    {item.scale}
                                                </TableCell>
                                                <TableCell>
                                                    {item.column_name}
                                                </TableCell>
                                                <TableCell>
                                                    <Checkbox></Checkbox>
                                                </TableCell>
                                                <TableCell>
                                                    <Checkbox></Checkbox>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>    
                        </Column>
                        </Grid>
                    </Tile>
                </Column>
            </Grid>
        </Theme>
    );
}

export default Catalog;