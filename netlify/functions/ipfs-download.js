// Netlify Function to proxy IPFS downloads
// This allows forcing download with Content-Disposition header

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get IPFS hash and filename from query parameters
        const params = event.queryStringParameters;
        const ipfsHash = params.hash;
        const fileName = params.fileName || 'download';

        if (!ipfsHash) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'IPFS hash is required' })
            };
        }

        // Fetch from IPFS gateway
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        console.log('Fetching from IPFS:', ipfsUrl);

        const response = await fetch(ipfsUrl);

        if (!response.ok) {
            console.error('IPFS fetch failed:', response.status);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to fetch from IPFS' })
            };
        }

        // Get the file as a buffer
        const buffer = await response.buffer();
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        // Return with Content-Disposition to force download
        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Access-Control-Allow-Origin': '*'
            },
            body: buffer.toString('base64'),
            isBase64Encoded: true
        };

    } catch (error) {
        console.error('IPFS download error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
