import './Business_Unit.css';
import React , { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Button, Search, Dropdown, IconButton, Pagination } from '@carbon/react';
import { Add, TrashCan, Power, CopyFile, Edit } from '@carbon/icons-react';

// const url = 'http://127.0.0.1:5000';
const url = 'http://127.0.0.1:5000';

function Business_Unit(){

    const getToken = async () => {
        try {
            const response = await axios.post(`${url}/get_token`);
            return response.data.token; // Adjust this according to your API response structure
        } catch (error) {
            console.error('Error fetching token:', error);
            throw error;
        }
    };


    const [data, setData] = useState([]);
    const fetchData= async()=> {
        try{
            const token= await getToken();
            const requestHeaders={
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const response= await axios.get(`${url}//get_business_units`, {headers: requestHeaders});
            console.log(response);
            console.log(response.data);
            console.log(response.data.data);

            let tempData = response.data.data;
            let roleIDArr = [];
            let roleNameArr = [];
            let finalData = [];

            for(let temp of tempData) {
                for(let roleData of temp.role) {
                    roleIDArr.push(roleData.role_id);
                    roleNameArr.push(roleData.role_name);
                }
                let joinedIdRole = roleIDArr.join(', '); 
                let joinedNameRole = roleNameArr.join(', '); 

                let obj = {
                    active_member: temp.active_member,
                    group_description: temp.group_description,
                    group_name: temp.group_name,
                    role_id: joinedIdRole,
                    role_name: joinedNameRole,
                }

                finalData.push(obj);  
            }
            console.log(finalData)
            setData(finalData);

        }catch(error){
            console.error(error);
        }
    };

    useEffect(()=>{
        fetchData();
    }, []);

    const columns=[
        {key:'group_name', header: 'Business Group Name'},
        {key:'group_description', header: 'Description'},
        {key:'role.role_id', header: 'Role ID'},
        {key:'role.role_name', header: 'Role Name'},
        {key:'active_member', header: 'Members Count'},
    ]

    return(
        <section className="business-unit">
            {/* title, action, and search */}
            <div className='title-action-search'>
                <p className='title'>Business Unit</p>
                {/* action button and search */}
                <div className='action-and-search'>
                    <div className='business-action'>
                        <div className='action-button'>
                            <IconButton label="add" kind='secondary'>
                                <Add className='button-add' />
                            </IconButton>
                            <p>Add</p>
                        </div>
                        <div className='action-button'>
                            <IconButton label="duplicate" kind='secondary'>
                                <CopyFile className='button-duplicate' />
                            </IconButton>
                            <p>Duplicate</p>
                        </div>
                        <div className='action-button'>
                                    <IconButton label="edit" kind='secondary'>
                                        <Edit className='button-edit' />
                                    </IconButton>
                                    <p>Edit</p>
                                </div>
                        <div className='action-button'>
                            <IconButton label="delete" kind='secondary'>
                                <TrashCan className='button-delete' />
                            </IconButton>
                            <p>Delete</p>
                        </div>
                        <div className='action-button'>
                            <IconButton label="activate" kind='secondary'>
                                <Power className='button-activate' />
                            </IconButton>
                            <p>Activate</p>
                        </div>
                    </div>
                    <div className='business-search'>
                        <Search size="lg" placeholder="Search" labelText="Search" closeButtonLabelText="Clear search input" id="search-1" onChange={() => { }} onKeyDown={() => { }} />
                    </div>  
                </div>
                {/* action button and search */}
            </div>
            {/* title, action, and search*/}

            {/* table get all list business unit */}
            <div className='container'>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((header)=>(
                                <TableHeader key={header.key} style={{width: 400}}>
                                    {header.header}
                                </TableHeader>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.map((row)=>(
                            <TableRow>
                                <TableCell>{row.group_name}</TableCell>
                                <TableCell>{row.group_description}</TableCell>
                                <TableCell>{row.role_id}</TableCell>
                                <TableCell>{row.role_name}</TableCell>
                                <TableCell>{row.active_member}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* table get all list business unit */}
        </section>
    )

}

export default Business_Unit;