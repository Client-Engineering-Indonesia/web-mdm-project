import './Data_Exchange.css';
import React from 'react';
import { DataTable, Button, Search, Dropdown } from '@carbon/react';

function Data_Exchange() {

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
  return (
    <section className='data-exchange'>
        {/* categories and vendors */}
        <section className= 'category-vendor'>
            <div className= 'category'>
                <p className='category-title'>Categories</p>
                <p>Categories_1</p>
                <p>Categories_2</p>
                <p>Categories_3</p>
            </div>
            <div className= 'vendor'>
                <p className='vendor-title'>Vendors</p>
                <p>Business Unit 1</p>
                <p>Business Unit 2</p>
                <p>Business Unit 3</p>
            </div>
        </section>
        {/* categories and vendors */}

        {/* content */}
        <section className='data-exchange-content'>
            <div className= 'product-catalog'>
                <div className='title'>
                    <p>PRODUCT CATALOG</p>
                    <Button size='md'>Request New Data Set</Button>
                </div>
                <Search size="lg" placeholder="Search" labelText="Search" closeButtonLabelText="Clear search input" id="search-1" onChange={() => {}} onKeyDown={() => {}} />
                <div className='sort'>
                    <p>All Data Product (1000 Results)</p>
                    <p>Showing 1 of 50</p>
                    <div>
                        <Dropdown id="default" items={items} label="Sort By" itemToString={item => item ? item.text : ''} />
                    </div>
                </div>

            </div>
            <div className='request-list'>

            </div>
        </section>
        {/* content */}


    </section>
    );
}

export default Data_Exchange;