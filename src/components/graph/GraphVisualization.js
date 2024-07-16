import React, { useState, useEffect } from 'react';
import Graph2 from '../../data/graph.png';
import { Grid, Column, DatePicker, DatePickerInput } from '@carbon/react';
import './GraphVisualization.css';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import Database from '../../data/database2.png';
import Person from '../../data/person1.png';

const url = 'http://127.0.0.1:5000';

const formatDate = (date) => {
    console.log(date)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

function initDiagram() {
    const $ = go.GraphObject.make;

    const diagram = new go.Diagram({
        'undoManager.isEnabled': true,  // must be set to allow for model change listening
        'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
        model: new go.GraphLinksModel({
            linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        })
    });

    // define a simple Node template with a vertical layout
    diagram.nodeTemplate = $(
        go.Node, 'Vertical',  // nodes will be placed vertically
        {
            locationSpot: go.Spot.Center,
            locationObjectName: 'PICTURE',
        },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(
            go.Picture,
            {
                name: 'PICTURE',
                margin: 10,
                width: 50,
                height: 50,
            },
            new go.Binding('source', 'type', (type) => type === 'user' ? Person : Database)
        ),
        $(
            go.TextBlock,
            {
                margin: 8,
                editable: true,  // the TextBlock's text is editable
                font: 'bold 14px sans-serif'
            },
            new go.Binding('text').makeTwoWay()  // binds the text of the TextBlock to the 'text' property of the node data
        )
    );

    return diagram;
}

function GraphVisualization({userRole}) {
    const [startDate, setStartDate] = useState("06-10-2024");
    const [endDate, setEndDate] = useState("07-15-2024");
    const [linkData, setLinkData] = useState([]);
    const [nodeData, setNodeData] = useState([]);
    
    const fetchData= async() => {

        if (!startDate || !endDate) {
            console.error('Start date or end date is not set');
            return;
        }

        const requestData = {
            "start_date": formatDate(new Date(startDate)),
            "end_date": formatDate(new Date(endDate))
        };
  
        try {
          const response = await fetch(`${url}/create_graph`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const responseData = await response.json();
          console.log('Response from server:', responseData);

          setLinkData(responseData.linkDataArray)
          setNodeData(responseData.nodeDataArray)
          console.log(linkData)

        } catch (error) {
          console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchData(); 
        }
    }, [startDate, endDate]);

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        console.log('Selected dates:', start, end); 
    };

    return <Grid>
        <Grid>
            <Column lg={16}>
                <div style={{marginTop: '2rem', marginBottom: '2rem'}}>
                    <DatePicker datePickerType="range" 
                    onChange={(eventOrDates) => {
                        if (Array.isArray(eventOrDates)) {
                            handleDateChange(eventOrDates);
                        } else {
                            handleDateChange(eventOrDates.detail.dates);
                        }
                    }}>
                        <DatePickerInput id="date-picker-input-id-start" placeholder="mm/dd/yyyy" labelText="Start date" size="md" />
                        <DatePickerInput id="date-picker-input-id-finish" placeholder="mm/dd/yyyy" labelText="End date" size="md" />
                    </DatePicker>
                </div>
            </Column>
        </Grid>
        <Column lg={16}>
        <div className={"diagram-component"}>
            <ReactDiagram
                initDiagram={initDiagram}
                divClassName='diagram-component'
                nodeDataArray={nodeData}
                linkDataArray={linkData}
            />
        </div>  
        </Column>
    </Grid>;
}

export default GraphVisualization;