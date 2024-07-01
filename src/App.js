import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; //npm i react-router-dom
import Data_Exchange from './components/data-exchange/Data_Exchange'; 
import USERS from './components / users/USERS';
import{
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  Button,
  HeaderMenuButton,
  Search,
  HeaderMenu,
  HeaderSideNavItems
}from '@carbon/react'; //import dari node_modules
import './App.css';

function App() {
  
  return (
    <>
    <Header className='header'>
        <div className='title-container'>
          {/* option+shift+down */}
          <p className='astra'>ASTRA DIGITAL</p>  
          <p className='data-fabric'>DATA FABRIC</p>
        </div>
        <HeaderNavigation >
          <div className='profile'>
            <div>
              <p className='role'>Business Unit - Admin</p>  
              <p className='name'>user_name</p> 
            </div>
             
            <Button size='sm' className='button'>Logout</Button>
          </div>
        </HeaderNavigation>

        <SideNav aria-label="Side navigation" href="#main-content">
          <SideNavItems>
            <SideNavMenu title="User Management">
              <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                Business Unit
              </SideNavMenuItem>
              <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                User Group
              </SideNavMenuItem>
              <SideNavMenuItem href="/users">
                Users
              </SideNavMenuItem>
              <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                Roles
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavMenu title="Repositories">
              <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                Endpoint
              </SideNavMenuItem>
              <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                Catalog
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavMenu title="Exchange">
              <SideNavMenuItem href="/data_exchange">
                Data Exchange
              </SideNavMenuItem>
              <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                Approval
              </SideNavMenuItem>
              <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                Publish
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavMenu title="Monitoring">
              <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                Activity Logs
              </SideNavMenuItem>
              <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                Audit Trail
              </SideNavMenuItem>
            </SideNavMenu>
          </SideNavItems>
        </SideNav>
        </Header>

        <section className='content'>
          {/* routing below */}
          <Router>
              <Routes>
                <Route path="/data_exchange" element={<Data_Exchange />} />
              </Routes>
          </Router>

          <Router>
              <Routes>
                <Route path='/USERS' element={<USERS />} />
              </Routes>
          </Router>
        </section>

  </>
  );
  
}

export default App;
