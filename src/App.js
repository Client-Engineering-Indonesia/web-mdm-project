import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; //npm i react-router-dom
import Data_Exchange from './components/data-exchange/Data_Exchange';
import Users from './components/Users/Users';
import Catalog from './components/catalog/Catalog';
import Endpoint from './components/Endpoint/Endpoint';
import AuditLogs from './components/AuditLogs/AuditLogs'
import Approval from './components/Approval/Approval';
import Publish from './components/Publish/Publish';
import Roles from './components/roles/Roles';
import Business_Unit from './components/business-unit/Business_Unit';
import Cookies from 'js-cookie';
import GraphVisualization from './components/graph/GraphVisualization';

import {
  Header,
  HeaderNavigation,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
  Button,
} from '@carbon/react'; //import dari node_modules
import './App.css';
import Login from './components/login-page/LoginPage';

function App() {
  const [isWebTokenPresent, setIsWebTokenPresent] = useState(false);
  const [userInfo, setUserInfo] = useState({
    "username": "",
    "role": "",
    "business_unit_name": ""
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const webToken = Cookies.get('web_token');
      if (webToken) {
        setIsWebTokenPresent(true);
        try {
          const response = await fetch('http://127.0.0.1:5000/user_info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: webToken }), // Send the token in the body
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data)
            setUserInfo(data.user_info);
            console.log(userInfo)
          } else {
            console.error('Failed to fetch user info:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      <Header className='header'>
        <div className='title-container'>
          {/* option+shift+down */}
          <p className='astra'>ASTRA DIGITAL</p>
          <p className='data-fabric'>DATA FABRIC</p>
        </div>
        <HeaderNavigation >
          {isWebTokenPresent && 
          <div className='profile'>
            <div>
              <p className='role'>{userInfo.business_unit_name} - {userInfo.role}</p>
              <p className='name'>{userInfo.username}</p>
            </div>
             <Button size='lg' className='button' kind="secondary">Logout</Button>
          </div>
          }
        </HeaderNavigation>

        <SideNav className='side-nav' aria-label="Side navigation" href="#main-content">
          <SideNavItems>
            <SideNavMenu title="User Management">
              <SideNavMenuItem href="/business_unit">
                Business Unit
              </SideNavMenuItem>
              <SideNavMenuItem href="https://www.carbondesignsystem.com/">
                User Group
              </SideNavMenuItem>
              <SideNavMenuItem href="/users">
                Users
              </SideNavMenuItem>
              <SideNavMenuItem href="/roles">
                Roles
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavMenu title="Repositories">
              <SideNavMenuItem href="/endpoint">
                Endpoint
              </SideNavMenuItem>
              <SideNavMenuItem href="/catalog">
                Catalog
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavMenu title="Exchange">
              <SideNavMenuItem href="/data_exchange">
                Data Exchange
              </SideNavMenuItem>
              <SideNavMenuItem href="/approval">
                Approval
              </SideNavMenuItem>
              {/* <SideNavMenuItem href="/publish">
                Publish
              </SideNavMenuItem> */}
            </SideNavMenu>
            <SideNavMenu title="Monitoring">
              <SideNavMenuItem href="/auditlogs">
                Audit and Logs
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavMenu title="Visualization">
              <SideNavMenuItem href="/access_graph">
                Access Graph
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
            <Route path='/users' element={<Users />} />
          </Routes>
        </Router>

        <Router>
          <Routes>
            <Route path='/business_unit' element={<Business_Unit />} />
          </Routes>
        </Router>

        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>

        <Router>
          <Routes>
            <Route path='/catalog' element={<Catalog />} />
          </Routes>
        </Router>
        <Router>
          <Routes>
            <Route path='/endpoint' element={<Endpoint />} />
          </Routes>
        </Router>

        <Router>
          <Routes>
            <Route path='/auditlogs' element={<AuditLogs />} />
          </Routes>
        </Router>
        <Router>
          <Routes>
            <Route path='/approval' element={<Approval />} />
          </Routes>
        </Router>
        <Router>
          <Routes>
            <Route path='/publish' element={<Publish />} />
          </Routes>
        </Router>
        <Router>
          <Routes>
            <Route path='/roles' element={<Roles />} />
          </Routes>
        </Router>
        <Router>
          <Routes>
            <Route path='/access_graph' element={<GraphVisualization />} />
          </Routes>
        </Router>
      </section>
    </>
  );
}

export default App;
