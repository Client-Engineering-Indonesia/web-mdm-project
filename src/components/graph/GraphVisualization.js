import React from 'react';
import Graph2 from '../../data/graph.png';
import { Grid, Column } from '@carbon/react';

function GraphVisualization({ userRole }) {
    const isAdmin = userRole.toLowerCase().includes('admin');

    return (
        <Grid>
            {isAdmin ? (
                <div style={{ marginTop: 50 }}>
                    <img src={Graph2} alt="Graph" width={1500} />
                </div>
            ) : (
                <Column lg={16}>
                    <div style={{
                        marginTop: 50,
                        padding: 20,
                        backgroundColor: '#ffdddd',
                        borderRadius: 5,
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: 18, fontWeight: 'bold', color: '#d8000c' }}>
                            You're not allowed to view this page.
                        </p>
                        <p style={{ fontSize: 16 }}>
                            You are a <span style={{ fontWeight: 'bold' }}>{userRole}</span>, only admins can view this page.
                        </p>
                    </div>
                </Column>
            )}
        </Grid>
    );
}

export default GraphVisualization;