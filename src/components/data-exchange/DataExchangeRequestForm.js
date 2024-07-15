import React, { useState, useEffect } from 'react';
import './RequestForm.css';
import { Form, Stack, TextInput, TextArea, Button } from '@carbon/react';
import Cookies from 'js-cookie';

// const url = 'http://127.0.0.1:5000';
const url = 'http://127.0.0.1:5000';

const DataExchangeRequestForm = ({ isOpen, onClose, tableName }) => {
  const [formData, setFormData] = useState({
    requestor_business_unit: '',
    requestor_username: '',
    requestor_role: 'Viewer',
    data_set_name: '',
    owner_email: '',
    owner_name: '',
    owner_phone: '',
    description: '',
    duration: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        data_set_name: tableName,
      }));
    }
  }, [isOpen, tableName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.requestor_business_unit) newErrors.requestor_business_unit = 'Business unit is required';
    if (!formData.requestor_username) newErrors.requestor_username = 'Requestor name is required';
    if (formData.duration && isNaN(formData.duration)) newErrors.duration = 'Duration must be a number';
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const webToken = Cookies.get('web_token');

      const requestData = {
        requestor_business_unit: formData.requestor_business_unit,
        requestor_username: formData.requestor_username,
        requestor_role: formData.requestor_role,
        table_name: formData.data_set_name,
        owner_email: formData.owner_email,
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
        description: formData.description,
        duration: formData.duration,
        webtoken: webToken
      };

      try {
        const response = await fetch(`${url}/create_request`, {
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
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <>
      <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{ width: '400px' }}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div style={{ marginTop: '2rem' }}>
          <h2>Request Access</h2>
        </div>
        <div>
          <Form onSubmit={handleSubmit}>
            <Stack gap={5}>
              <TextInput
                id="requestor-business-unit"
                labelText={<span style={{ color: 'white' }}>Business Unit</span>}
                name="requestor_business_unit"
                value={formData.requestor_business_unit}
                onChange={handleChange}
                invalid={!!errors.requestor_business_unit}
                invalidText={errors.requestor_business_unit}
              />
              <TextInput
                id="requestor-username"
                labelText={<span style={{ color: 'white' }}>Requestor Name</span>}
                name="requestor_username"
                value={formData.requestor_username}
                onChange={handleChange}
                invalid={!!errors.requestor_username}
                invalidText={errors.requestor_username}
              />
              <TextInput
                id="owner-email"
                labelText={<span style={{ color: 'white' }}>Owner Email</span>}
                name="owner_email"
                value={formData.owner_email}
                onChange={handleChange}
              />
              <TextInput
                id="owner-name"
                labelText={<span style={{ color: 'white' }}>Owner Name</span>}
                name="owner_name"
                value={formData.owner_name}
                onChange={handleChange}
              />
              <TextInput
                id="owner-phone"
                labelText={<span style={{ color: 'white' }}>Owner Phone</span>}
                name="owner_phone"
                value={formData.owner_phone}
                onChange={handleChange}
              />
              <TextArea
                id="description"
                labelText={<span style={{ color: 'white' }}>Description</span>}
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
              <TextInput
                id="duration"
                labelText={<span style={{ color: 'white' }}>Duration (Days)</span>}
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                invalid={!!errors.duration}
                invalidText={errors.duration}
                type="number"
              />
              <div>
                <Button type="button" onClick={onClose} kind="secondary" style={{ width: '10rem' }}>Cancel</Button>
                <Button type="submit" style={{ marginLeft: '2.5rem', width: '10rem' }}>Request</Button>
              </div>
            </Stack>
          </Form>
        </div>
      </div>
    </>
  );
};

export default DataExchangeRequestForm;