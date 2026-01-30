// Netlify Function to proxy Pinata file uploads
// This keeps your JWT token secure on the server side

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get Pinata JWT from environment variable
        const PINATA_JWT = process.env.PINATA_JWT;

        if (!PINATA_JWT) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Pinata JWT not configured' })
            };
        }

        // Parse the incoming request
        const contentType = event.headers['content-type'] || '';

        if (!contentType.includes('multipart/form-data')) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid request format. Content-Type must be multipart/form-data' })
            };
        }

        // Netlify encodes binary data as base64 in the body
        // We need to decode it before forwarding to Pinata
        const bodyBuffer = event.isBase64Encoded
            ? Buffer.from(event.body, 'base64')
            : Buffer.from(event.body);

        // Forward the file to Pinata
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                'Content-Type': contentType
            },
            body: bodyBuffer
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Pinata API error:', data);
            return {
                statusCode: response.status,
                body: JSON.stringify(data)
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Pinata upload error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
