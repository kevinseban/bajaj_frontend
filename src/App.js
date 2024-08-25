// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, FormControl, InputLabel, MenuItem, Select as MuiSelect, Chip } from '@mui/material';

const App = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleJsonChange = (e) => {
        setJsonInput(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            // Validate JSON format
            if (!jsonInput.trim()) {
                throw new Error('Input cannot be empty.');
            }
            const parsedData = JSON.parse(jsonInput);

            if (!parsedData || !Array.isArray(parsedData.data)) {
                throw new Error('Invalid JSON structure: "data" should be an array.');
            }

            const res = await axios.post('https://bajaj-backend-zeta.vercel.app/bfhl', parsedData);
            setResponse(res.data);
        } catch (error) {
            console.error('Error submitting JSON:', error);
            alert('Invalid JSON or API error: ' + error.message);
        }
    };

    const handleDropdownChange = (event) => {
        setSelectedOptions(event.target.value);
    };

    const renderResponse = () => {
        if (!response) return null;

        const options = selectedOptions;
        const result = {};

        if (options.includes('Alphabets')) {
            result.alphabets = response.alphabets;
        }
        if (options.includes('Numbers')) {
            result.numbers = response.numbers;
        }
        if (options.includes('Highest lowercase alphabet')) {
            result.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
        }

        return (
            <div>
                <Typography variant="h6" gutterBottom>
                    Filtered Data:
                </Typography>
                <div>
                    {options.includes('Alphabets') && response.alphabets.length > 0 && (
                        <Typography variant="body1" gutterBottom>
                            <strong>Alphabets:</strong> {response.alphabets.join(', ')}
                        </Typography>
                    )}
                    {options.includes('Numbers') && response.numbers.length > 0 && (
                        <Typography variant="body1" gutterBottom>
                            <strong>Numbers:</strong> {response.numbers.join(', ')}
                        </Typography>
                    )}
                    {options.includes('Highest lowercase alphabet') && response.highest_lowercase_alphabet.length > 0 && (
                        <Typography variant="body1" gutterBottom>
                            <strong>Highest lowercase alphabet:</strong> {response.highest_lowercase_alphabet.join(', ')}
                        </Typography>
                    )}
                    {options.length === 0 && (
                        <Typography variant="body1" gutterBottom>
                            No data selected.
                        </Typography>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Container maxWidth="sm">
            <TextField
                fullWidth
                label="API Input"
                multiline
                rows={2}
                value={jsonInput}
                onChange={handleJsonChange}
                placeholder='Enter JSON data'
                variant="outlined"
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
            >
                Submit
            </Button>

            {response && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Multi Filter</InputLabel>
                    <MuiSelect
                        multiple
                        value={selectedOptions}
                        onChange={handleDropdownChange}
                        renderValue={(selected) => (
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} style={{ margin: 2 }} />
                                ))}
                            </div>
                        )}
                    >
                        <MenuItem value="Alphabets">Alphabets</MenuItem>
                        <MenuItem value="Numbers">Numbers</MenuItem>
                        <MenuItem value="Highest lowercase alphabet">Highest lowercase alphabet</MenuItem>
                    </MuiSelect>
                </FormControl>
            )}

            {renderResponse()}
        </Container>
    );
};

export default App;
