import './Endpoint.css'
import { React, useState, useEffect } from 'react';
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    Button, Search, Dropdown, IconButton, Pagination, Modal, Select, SelectItem, TextInput
} from '@carbon/react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import { Add, CopyFile, TrashCan, Edit, Power } from '@carbon/icons-react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'
import axios from 'axios';

const url = 'http://52.118.170.239:8443';
// const url = 'http://52.118.170.239:8443';
// 

export default function ENDPOINT() {

    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isToken, setIsToken] = useState(Cookies.get('web_token') || '');

    const toggleModal = () => {
        setIsModalOpen(prevState => !prevState);
    };

    const [internalData, setInternalData] = useState([]);
    const [externalData, setExternalData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        console.log('Token in useEffect:', isToken);
    }, [isToken]); // This will run whenever isToken changes

    useEffect(() => {
        // If you need to update the token dynamically, you can still do so here
        const token = Cookies.get('web_token');
        setIsToken(token || '');
        fetchData();
    }, []); // This runs once on component mount

    // const fetchData = async () => {
    //     const webToken= Cookies.get('web_token');
    //     const requestData= {
    //         webtoken: webToken
    //     };
    //     try{
    //         const response = await fetch(`${url}/get_endpoint_data`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //               },
    //               body: JSON.stringify({ webtoken: webToken }), // Send the token in the body
    //         });
    //         console.log(response);

    //         const responseData = await JSON.stringify(response);
    //         console.log('Response:', responseData);
    //         setData(responseData);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    const fetchData= async() => {
        try {
            const token= isToken;
            const requestData={
                webtoken: token
            };

            const response= await axios.post(`${url}/get_endpoint_data`, requestData, {
                headers: {
                    'Content-Type': 'application/json', 
                }
            });
            console.log(response);
            console.log(response.data.result.internal);
            console.log(response.data.result.external);
            setInternalData(response.data.result.internal);
            setExternalData(response.data.result.external);
            setLoading(false);
        }catch(error){
            console.error('Error:', error);
        }
    }


    const submithandler = () => {
        console.log('submit');
        setIsModalOpen(false);
    };

    const columns = [
        {
            key: 'endpoint_name',
            header: 'Endpoint Name',
        },
        {
            key: 'status',
            header: 'Status',
        },
        {
            key: 'engine',
            header: 'Engine',
        },
        {
            key: 'hostname',
            header: 'Hostname',
        },
        {
            key: 'port',
            header: 'Port',
        },
        {
            key: 'db_name',
            header: 'Database Name',
        },
        {
            key: 'table_owner',
            header: 'Table Owner',
        },
        {
            key: 'created_at',
            header: 'Created At',
        },
        {
            key: 'owner_business_unit_id',
            header: 'Owner BU ID',
        },
        {
            key: 'viewers',
            header: 'Viewers',
        },
    ];


    return (
        <section className='endpoint'>

            <div className='endpoint-tab'>
                <Tabs>
                    <TabList aria-label="List of tabs">
                        <Tab>Internal</Tab>
                        <Tab>External</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                        <div className='endpoint-content'>
                <div className='options'>
                    <div className='menus'>
                        <div className='menu-name-images'>
                            <IconButton label="add" kind='primary' onClick={toggleModal}>
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
                            {Array.isArray(internalData) && internalData.map((row, i) => (
                                <TableRow
                                    key={row.id}
                                >
                                    <TableCell>{row.endpoint_name}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.engine}</TableCell>
                                    <TableCell>{row.hostname}</TableCell>
                                    <TableCell>{row.port}</TableCell>
                                    <TableCell>{row.db_name}</TableCell>
                                    <TableCell>{row.table_owner}</TableCell>
                                    <TableCell>{row.created_at}</TableCell>
                                    <TableCell>{row.owner_business_unit_id}</TableCell>
                                    <TableCell>{row.viewers}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                        </TabPanel>

                        <TabPanel>
                        <div className='endpoint-content'>
                <div className='options'>
                    <div className='menus'>
                        <div className='menu-name-images'>
                            <IconButton label="add" kind='primary' onClick={toggleModal}>
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
                            {Array.isArray(externalData) && externalData.map((row, i) => (
                                <TableRow
                                    key={row.id}
                                >
                                    <TableCell>{row.endpoint_name}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.engine}</TableCell>
                                    <TableCell>{row.hostname}</TableCell>
                                    <TableCell>{row.port}</TableCell>
                                    <TableCell>{row.db_name}</TableCell>
                                    <TableCell>{row.table_owner}</TableCell>
                                    <TableCell>{row.created_at}</TableCell>
                                    <TableCell>{row.owner_business_unit_id}</TableCell>
                                    <TableCell>{row.viewers}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>

            

            <div className='modal'>
                <Modal
                    open={isModalOpen}
                    modalHeading="Add New Endpoint"
                    primaryButtonText="Submit"
                    secondaryButtonText="Cancel"
                    onRequestClose={toggleModal}
                    onRequestSubmit={submithandler}
                >
                    <TextInput data-modal-primary-focus id="EndpointName" labelText=" Endpoint Name" placeholder="" />
                    <TextInput data-modal-primary-focus id="Status" labelText="Status" placeholder="" />
                    <Select id="select-1" defaultValue="MSSQL SERVER" labelText="Engine">
                        <SelectItem value="MSSQL SERVER" text="MSSQL SERVER" />
                        <SelectItem value="ORACLE" text="ORACLE" />
                        <SelectItem value="MYSQL" text="MYSQL" />
                        <SelectItem value="Postgresql" text="Postgresql" />
                    </Select>
                    <TextInput data-modal-primary-focus id="Hostname" labelText="Hostname" placeholder="" />
                    <TextInput data-modal-primary-focus id="Port" labelText="Port" placeholder="" />
                    <TextInput data-modal-primary-focus id="DatabaseName" labelText="Database Name" placeholder="" />
                    <TextInput data-modal-primary-focus id="SchemaName" labelText="Schema Name" placeholder="" />
                    <TextInput data-modal-primary-focus id="UserName" labelText="Username" placeholder="" />
                    <TextInput data-modal-primary-focus id="Password" labelText="Password" placeholder="" />
                </Modal>
            </div>
        </section>


    );
}
