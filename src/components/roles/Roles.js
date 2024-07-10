// import './Role.css';
import React from 'react';
import { Button, Search, Row, Dropdown, Grid, Tile, Column, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
import axios from 'axios'; // Import Axios

function Roles() {
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
            table_name: 'MASTER_TABLE_4',
            table_schema: 'dbo',
            table_size: '18kb',
            total_column: 15
        },
        {
            id: 1,
            table_name: 'MASTER_TABLE_5',
            table_schema: 'dbo',
            table_size: '18kb',
            total_column: 10
        },
        {
            id: 2,
            table_name: 'MASTER_TABLE_6',
            table_schema: 'dbo',
            table_size: '18kb',
            total_column: 12
        },
        {
            id: 3,
            table_name: 'TRANSACION_TABLE_1',
            table_schema: 'dbo',
            table_size: '18kb',
            total_column: 16
        },
        {
            id: 4,
            table_name: 'TRANSACION_TABLE_2',
            table_schema: 'dbo',
            table_size: '18kb',
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
    ];

    return (
        <section className='roles' style={{ width: '100%' }}>
  
        </section>
    );
}

export default Roles;
