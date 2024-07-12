import React from 'react';
import './RequestForm.css';
import { Form, Stack, TextInput } from '@carbon/react';

const DataExchangeRequestForm = ({ isOpen, onClose }) => {
    return (
        <>
        <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
          <button className="close-btn" onClick={onClose}>×</button>
          <div style={{marginTop: '2rem'}}>
            Request Access
          </div>
          <div>
            <Form>
              <Stack gap={7}>
                <TextInput {...TextInputProps} />
              </Stack>
            </Form>
          </div>
          </div>
      </>
    );
  };

export default DataExchangeRequestForm;