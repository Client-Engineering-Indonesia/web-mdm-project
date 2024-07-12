import './Data_Exchange.css';
import React, { useState, useEffect } from 'react';
import { Button, Search, Dropdown } from '@carbon/react';
import axios from 'axios'; // Import Axios
import Cookies from 'js-cookie';
import DataExchangeRequestForm from './DataExchangeRequestForm';

const url1 = 'http://52.118.170.239:8443';
const url2 = 'http://127.0.0.1:5000';

function Data_Exchange() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedTableName, setSelectedTableName] = useState(''); // State for the selected table name
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const items = [
        {
            id: 'option-0',
            text: 'Business Unit 1',
            tagId: '15'
        },
        {
            id: 'option-1',
            text: 'Business Unit 2',
            tagId: '16'
        },
    ];

    const arrayObject = [
        {
            table_name: 'BU_A_CUSTOMER',
            business_name: 'Business Unit 1',
            description: 'Data set of car sales from 2023 to 2024. cleansed and parsed'
        },
        {
            table_name: 'BU_B_CUSTOMER',
            business_name: 'Business Unit 2',
            description: 'Data set of car sales from 2023 to 2024. cleansed and parsed'
        },
        {
            table_name: 'BU_A_B_Joined',
            business_name: 'Business Unit 3',
            description: 'Data set of car sales from 2023 to 2024. cleansed and parsed'
        },
        {
            table_name: 'CUSTOMER_TEST',
            business_name: 'Business Unit 4',
            description: 'Data set of car sales from 2023 to 2024. cleansed and parsed'
        },
    ];

    const loadButtonState = () => {
        const savedState = Cookies.get('buttonState');
        return savedState ? JSON.parse(savedState) : Array(arrayObject.length).fill(false);
    };

    const [changeButton, setChangeButton] = useState(loadButtonState);
    useEffect(() => {
        Cookies.set('buttonState', JSON.stringify(changeButton), { expires: 100000 });
    }, [changeButton]);

    console.log(changeButton);
    console.log(arrayObject.length);

    const onClick = async (index) => {
        const getToken = async () => {
            try {
                const response = await axios.post(`${url2}/get_token`);
                return response.data.token; // Adjust this according to your API response structure
            } catch (error) {
                console.error('Error fetching token:', error);
                throw error;
            }
        }
        const token = await getToken(); // Get the token first
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        try {
            if (changeButton[index] === false) {
                const response = await axios.post(`${url2}/grant_access`, {
                    table_name: arrayObject[index].table_name,
                }, { headers });
                console.log('Request successful:', response);
            } else {
                const table_name = arrayObject[index].table_name;
                const table_schema = 'DANENDRA.ATHALLARIQ@IBM.COM';
                const response = await axios.delete(`${url2}/revoke_access/adi.wijaya@ibm.com`, {
                    headers: headers,
                    params: { table_name, table_schema }
                });
                console.log('Revoke successful:', response);
            }

            const newChangeButton = [...changeButton];
            newChangeButton[index] = !newChangeButton[index];
            setChangeButton(newChangeButton);
        } catch (error) {
            console.error('Error making request:', error.response ? error.response.data : error.message);
        }

        const handleRequestAccess = (tableName) => {
            setSelectedTableName(tableName); // Set the selected table name
            toggleSidebar(); // Open the sidebar
        };

        return (
            <section className='data-exchange'>
                {/* categories and vendors */}
                <section className='category-vendor'>
                    <div className='category'>
                        <p className='category-title'>Categories</p>
                        <p>Categories_1</p>
                        <p>Categories_2</p>
                        <p>Categories_3</p>
                    </div>
                    <div className='vendor'>
                        <p className='vendor-title'>Vendors</p>
                        <p>Business Unit 1</p>
                        <p>Business Unit 2</p>
                        <p>Business Unit 3</p>
                    </div>
                </section>
                {/* content */}
                <section className='data-exchange-content'>
                    <div className='product-catalog'>
                        <div className='title'>
                            <p className='product-catalog-title'>PRODUCT CATALOG</p>
                            <Button size='md'>Request New Data Set</Button>
                        </div>
                        <div className='title-content'>
                            <Search size="lg" placeholder="Search" labelText="Search" closeButtonLabelText="Clear search input" id="search-1" onChange={() => { }} />
                            <div className='sort'>
                                <p>All Data Product (1000 Results)</p>
                                <p>Showing 1 of 50</p>
                                <div className='dropdown'>
                                    <Dropdown id="default" items={items} label="Sort By" itemToString={item => item ? item.text : ''} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='request-list'>
                        {arrayObject.map((item, index) => (
                            <div key={index} className='list-detail'>
                                <p>{item.table_name}</p>
                                <p>{item.business_name}</p>
                                <p>{item.description}</p>
                                {changeButton[index] === false &&
                                    <Button size='md' onClick={() => handleRequestAccess(item.table_name)} className='request-access'>Request Access</Button>
                                }
                                {changeButton[index] === true &&
                                    <Button size='md' className='request-access'>Revoke</Button>
                                }
                            </div>
                        ))}
                    </div>
                </section>
                <DataExchangeRequestForm isOpen={isSidebarOpen} onClose={toggleSidebar} tableName={selectedTableName} />
            </section>
        );
    }

    export default Data_Exchange;