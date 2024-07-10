import React, { useState } from 'react';
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectItem,
  TextInput,
  Button,
  TextArea
} from '@carbon/react';
import './Publish.css';

const Publish = () => {
  const [selectedTable, setSelectedTable] = useState('MASTER_TABLE_1');
  const [filter, setFilter] = useState({ columnName: '', operator: '', value: '' });
  const tables = ['MASTER_TABLE_1', 'MASTER_TABLE_2', 'MASTER_TABLE_3', 'TRANSACTION_TABLE_3'];

  const handleTableSelect = (event) => {
    setSelectedTable(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const headers = ['Column_1', 'Column_2', 'Column_3', 'Column_4', 'Column_5', 'Column_6', 'Column_7'];
  const rows = [
    // Add your data rows here
  ];

  return (
    <div className="data-preview-container">
      <div className="selectors">
        <Select id="database-select" labelText="" onChange={() => {}}>
          <SelectItem text="DB_MSSQL_1" value="DB_MSSQL_1" />
        </Select>
        <Select id="schema-select" labelText="" onChange={() => {}}>
          <SelectItem text="dbo" value="dbo" />
        </Select>
      </div>
      <div className="search-bar">
        <TextInput id="search-input" labelText="" placeholder="Search" />
      </div>
      <div className="content">
        <div className="table-list">
          {tables.map((table) => (
            <div
              key={table}
              className={`table-item ${table === selectedTable ? 'selected' : ''}`}
              onClick={() => setSelectedTable(table)}
            >
              {table}
            </div>
          ))}
        </div>
        <div className="data-preview">
          <DataTable rows={rows} headers={headers}>
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
              <TableContainer>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header}
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
              </TableContainer>
            )}
          </DataTable>
          <div className="pagination">1/3</div>
        </div>
      </div>
      <div className="dataset-form">
        <div className="form-group">
          <TextInput id="dataset-name" labelText="Data Set Name" />
        </div>
        <div className="form-group">
          <TextArea id="description" labelText="Description" rows={4} />
        </div>
        <div className="filters">
          <div className="filter-row">
            <Select id="column-name" labelText="" onChange={handleFilterChange} name="columnName">
              <SelectItem text="Column Name" value="" />
              {/* Add column options here */}
            </Select>
            <Select id="operator" labelText="" onChange={handleFilterChange} name="operator">
              <SelectItem text="Operator" value="" />
              {/* Add operator options here */}
            </Select>
            <TextInput id="value" labelText="" placeholder="Value" onChange={handleFilterChange} name="value" />
            <Button>Add</Button>
          </div>
          {/* Add more filter rows as needed */}
        </div>
      </div>
    </div>
  );
};

export default Publish;
