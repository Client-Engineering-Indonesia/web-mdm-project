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
            table_schema: 'DANENDRA.ATHALLARIQ@IBM.COM',
            business_name: 'Business Unit 1',
            request_timestamp: 'Jul 19, 2024 2:14 PM',
            is_approved: true,
            is_requested: true,
            requestor_username: "user",

        },
        {
            table_name: 'BU_B_CUSTOMER',
            table_schema: 'DANENDRA.ATHALLARIQ@IBM.COM',
            business_name: 'Business Unit 2',
            request_timestamp: 'Jul 19, 2024 2:14 PM',
            is_approved: false,
            is_requested: true,

        },
        {
            table_name: 'BU_A_B_JOINED',
            table_schema: 'DANENDRA.ATHALLARIQ@IBM.COM',
            business_name: 'Business Unit 2',
            request_timestamp: 'Jul 19, 2024 2:22 PM',
            is_approved: null,
            is_requested: false,

        },
        {
            table_name: 'AUDIT',
            table_schema: 'DANENDRA.ATHALLARIQ@IBM.COM',
            business_name: 'Business Unit 1',
            request_timestamp: 'Jul 4, 2024 3:27 PM',
            is_approved: null,
            is_requested: false,

        },
        {
            table_name: 'MORTGAGE_CANDIDATE',
            table_schema: 'DANENDRA.ATHALLARIQ@IBM.COM',
            business_name: 'Business Unit 2',
            request_timestamp: 'Jul 4, 2024 3:27 PM',
            is_approved: true,
            is_requested: true,

        },
        {
            table_name: 'EMPLOYEE_RECORDS',
            table_schema: 'CPADMIN',
            business_name: 'Business Unit 3',
            request_timestamp: 'Jul 1, 2024 2:03 PM',
            is_approved: true,
            is_requested: true,

        },
        {
            table_name: 'CUSTOMER_TEST',
            table_schema: 'DANENDRA.ATHALLARIQ@IBM.COM',
            business_name: 'Business Unit 4',
            request_timestamp:'Jun 29, 2024 10:51 PM',
            is_approved: false,
            is_requested: true,

        },
        {
            table_name: 'EMPLOYEE',
            table_schema: 'CPADMIN',
            business_name: 'Business Unit 4',
            request_timestamp:'Jun 28, 2024 1:38 PM',
            is_approved: null,
            is_requested: false,

        },
    ];


    // const [buttonState, setButtonState] = useState({ label: '', disabled: false, onClick: null });

    // useEffect(() => {
    //     loadButtonState();
    // }, []);
      
    // const loadButtonState = () => {
    //     // if is_approved is true and is_requqested is true, then the button should be revoke
    //     // if is_approved is false and is_requested is true, then the button should be pending approval, make button disable
    //     // if is_approved is null and is_requested is false, then the button should be request access
    //     // do it without cookies, but based on is_approved and is_requested
    //     const { is_approved, is_requested } = arrayObject;
    //     console.log(is_approved, is_requested);

    //     if (is_approved === true && is_requested === true) {
    //         setButtonState({ label: 'Revoke', disabled: false, onClick: null });
    //       } else if (is_approved === false && is_requested === true) {
    //         setButtonState({ label: 'Pending Approval', disabled: true, onClick: null });
    //       } else if (is_approved === null && is_requested === false) {
    //         setButtonState({ label: 'Request Access', disabled: false, onClick: toggleSidebar });
    //       } else {
    //         setButtonState({ label: 'Unknown State', disabled: true, onClick: null });
    //     }
    // };

    const ButtonComponent = ({ item }) => {
        const [buttonState, setButtonState] = useState({ label: '', disabled: false, onClick: null });
    
        useEffect(() => {
          loadButtonState();
        }, [item]); // Trigger useEffect whenever item changes
    
        const loadButtonState = () => {
            // if is_approved is true and is_requqested is true, then the button should be revoke
            // if is_approved is false and is_requested is true, then the button should be pending approval, make button disable
            // if is_approved is null and is_requested is false, then the button should be request access
            // do it without cookies, but based on is_approved and is_requested
          const { is_approved, is_requested } = item;
    
          if (is_approved === true && is_requested === true) {
            setButtonState({ label: 'Revoke', disabled: false, onClick: null });
          } else if (is_approved === false && is_requested === true) {
            setButtonState({ label: 'Pending Approval', disabled: true, onClick: null });
          } else if (is_approved === null && is_requested === false) {
            setButtonState({ label: 'Request Access', disabled: false, onClick: toggleSidebar });
          } else {
            setButtonState({ label: 'Unknown State', disabled: true, onClick: null });
          }
        };
    
        return (
            <Button kind="primary" onClick={buttonState.onClick} disabled={buttonState.disabled}>
                {buttonState.label}
            </Button>
        );
      };

    


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
                            <p>Table Name: {item.table_name}</p>
                            <p>Table Schema: {item.table_schema}</p>
                            <p>Business Name: {item.business_name}</p>
                            <p>Created Date: {item.request_timestamp}</p>
                            <ButtonComponent item={item} />
                        </div>
                    ))}
                </div>
            </section>
            <DataExchangeRequestForm isOpen={isSidebarOpen} onClose={toggleSidebar} />
        </section>
    );
}

export default Data_Exchange;