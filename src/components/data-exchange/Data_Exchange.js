import './Data_Exchange.css';
import React, { useState, useEffect } from 'react';
import { Button, Search, Dropdown } from '@carbon/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import DataExchangeRequestForm from './DataExchangeRequestForm';

const url = 'http://127.0.0.1:5000';


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
            text: 'DANENDRA.ATHALLARIQ@IBM.COM',
            tagId: '15'
        },
        {
            id: 'option-1',
            text: 'test@mail.com',
            tagId: '16'
        },
        {
            id: 'option-1',
            text: 'schema',
            tagId: '17'
        },
    ];
    

    const [data, setData] = useState([]);
    const [isToken, setIsToken] = useState(Cookies.get('web_token') || '');

    useEffect(() => {
        console.log('Token in useEffect:', isToken);
    }, [isToken]); // This will run whenever isToken changes
    
    useEffect(() => {
        const token = Cookies.get('web_token');
        setIsToken(token || '');
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = isToken;
            const response = await axios.get(`${url}/get_assets`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    webtoken: token
                }
            });
            console.log(response);
            console.log(response.data.data);
            setData(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    // State to track the submission status of each item
    const [submissionStatus, setSubmissionStatus] = useState(
        data.map(() => false)
    );

    console.log(submissionStatus)

    const handleSubmission = (index) => {
        const newStatus = [...submissionStatus];
        newStatus[index] = true;
        setSubmissionStatus(newStatus);
    };

    const ButtonComponent = ({ item, index }) => {
        const [buttonState, setButtonState] = useState({ label: '', disabled: false, onClick: null });
    
        useEffect(() => {
          loadButtonState();
        }, [item, submissionStatus[index]]); // Trigger useEffect whenever item or submission status changes
    
        const loadButtonState = () => {
          if (submissionStatus[index]) {
            setButtonState({ label: 'Pending Approval', disabled: true, onClick: null });
          } else {
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
          }
        };
    
        return (
          <Button kind="primary" onClick={buttonState.onClick} disabled={buttonState.disabled}>
            {buttonState.label}
          </Button>
        );
    };


    // useEffect(() => {
    //     if (selectedFilter) {
    //         setFilteredItems(data.filter(item => item.table_schema === selectedFilter.text));
    //     } else {
    //         setFilteredItems(data);
    //     }
    // }, [selectedFilter]);

    // const handleDropdownChange = (event) => {
    //     setSelectedFilter(event.selectedItem);
    // };

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
                                <Dropdown id="default" items={items} label="Sort By" itemToString={item => item ? item.text : ''} />
                                    
                            </div>
                        </div>
                    </div>
                </div>
                <div className='request-list'>
                    {Array.isArray(data) && data.map((item, index) => (
                        <div key={index} className='list-detail'>
                            <p>Table Name: {item.table_name}</p>
                            <p>Table Schema: {item.table_schema}</p>
                            <ButtonComponent item={item} />
                            <DataExchangeRequestForm
                                isOpen={isSidebarOpen}
                                onClose={toggleSidebar}
                                onSubmit={() => handleSubmission(index)}
                            />
                        </div>
                    ))}
                </div>
            </section>
            {/* <DataExchangeRequestForm isOpen={isSidebarOpen} onClose={toggleSidebar} onSubmit={() => handleSubmission(index)}/> */}
        </section>
    );
}

export default Data_Exchange;