import './Data_Exchange.css';
import React, { useState, useEffect } from 'react';
import { Button, Search, Dropdown } from '@carbon/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import DataExchangeRequestForm from './DataExchangeRequestForm';

const url = 'http://52.118.170.239:8443';

function Data_Exchange() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);

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

    useEffect(() => {
        if (selectedFilter) {
            setFilteredItems(arrayObject.filter(item => item.business_name === selectedFilter.text));
        } else {
            setFilteredItems(arrayObject);
        }
    }, [selectedFilter]);

    const handleDropdownChange = (event) => {
        setSelectedFilter(event.selectedItem);
    };

    return (
        <section className='data-exchange'>
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
            <section className='data-exchange-content'>
                <div className='product-catalog'>
                    <div className='title'>
                        <p className='product-catalog-title'>PRODUCT CATALOG</p>
                        <Button size='md'>Request New Data Set</Button>
                    </div>
                    <div className='title-content'>
                        <Search size="lg" placeholder="Search" labelText="Search" closeButtonLabelText="Clear search input" id="search-1" onChange={() => { }} onKeyDown={() => { }} />
                        <div className='sort'>
                            <p>All Data Product (1000 Results)</p>
                            <p>Showing 1 of 50</p>
                            <div className='dropdown'>
                                <Dropdown id="default" items={items} label="Sort By" itemToString={item => item ? item.text : ''} onChange={handleDropdownChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='request-list'>
                    {filteredItems.map((item, index) => (
                        <div key={index} className='list-detail'>
                            <p>{item.table_name}</p>
                            <p>{item.business_name}</p>
                            <p>{item.description}</p>
                            {changeButton[index] === false && <Button size='md' onClick={toggleSidebar} className='request-access'>Request Access</Button>}
                            {changeButton[index] === true && <Button size='md' className='request-access'>Revoke</Button>}
                        </div>
                    ))}
                </div>
            </section>
            <DataExchangeRequestForm isOpen={isSidebarOpen} onClose={toggleSidebar} />
        </section>
    );
}

export default Data_Exchange;