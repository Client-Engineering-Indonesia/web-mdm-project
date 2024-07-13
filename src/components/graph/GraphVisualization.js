import React from 'react';
import Graph2 from '../../data/graph.png';
import { Grid } from '@carbon/react';

function GraphVisualization() {
    return <Grid>
        <div style={{marginTop: 50}}>
            <img src={Graph2} alt="Graph" width={1500}/>
        </div> 
    </Grid>;
}

export default GraphVisualization;