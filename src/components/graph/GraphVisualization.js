import React from 'react';
import Graph2 from '../../data/graph.png';
import { Grid, Column } from '@carbon/react';

function GraphVisualization({userRole}) {
    return <Grid>
        {userRole.toLowerCase().includes('admin') ?  <div style={{marginTop: 50}}>
            <img src={Graph2} alt="Graph" width={1500}/>
        </div>  : 
        <Column lg={16}>
            <div style={{width: '100%'}}>You're not allowed to view this page.</div>
        </Column>
        }
    </Grid>;
}

export default GraphVisualization;