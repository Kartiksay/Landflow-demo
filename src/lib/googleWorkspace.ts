/**
 * Google Workspace API Client-Side Integration Helpers
 * Handles interaction with Gmail and Google Sheets APIs using the OAuth access token.
 */

// Format Gmail Raw Email Payload
export function formatGmailRaw(to: string, subject: string, htmlContent: string): string {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const emailLines = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    btoa(unescape(encodeURIComponent(htmlContent)))
  ];
  const email = emailLines.join('\r\n');
  return btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email using the Gmail API
 */
export async function sendGmailEmail(accessToken: string, to: string, subject: string, htmlContent: string) {
  const safeRaw = formatGmailRaw(to, subject, htmlContent);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: safeRaw
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to transmit via Gmail node.');
  }

  return response.json();
}

/**
 * Creates a Google Sheet and populates it with Leads data
 */
export async function exportLeadsToSheets(accessToken: string, title: string, leads: any[]) {
  // 1. Create Spreadsheet
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: title || 'LeadFlow AI Exported Leads'
      }
    })
  });

  if (!createResponse.ok) {
    const errorData = await createResponse.json();
    throw new Error(errorData.error?.message || 'Failed to initialize spreadsheet.');
  }

  const { spreadsheetId, spreadsheetUrl } = await createResponse.json();

  // 2. Prepare Headers and Rows
  const headers = ['Company', 'Name', 'Email', 'Website', 'Industry', 'Funnel Status', 'AI Score', 'AI Fit Category'];
  const values = [
    headers,
    ...leads.map(l => [
      l.company || '',
      l.name || '',
      l.email || '',
      l.website || '',
      l.industry || '',
      l.status || 'NEW',
      l.aiScore || 'N/A',
      l.aiCategory || 'NOT ANALYZED'
    ])
  ];

  // 3. Write Values to Sheet
  const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:H${values.length}?valueInputOption=RAW`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values
    })
  });

  if (!updateResponse.ok) {
    const errorData = await updateResponse.json();
    throw new Error(errorData.error?.message || 'Failed to feed records into spreadsheet.');
  }

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Extracts Spreadsheet ID from various string formats (including full URL)
 */
export function extractSpreadsheetId(input: string): string {
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return input.trim();
}

/**
 * Imports leads from a Google Sheet URL/ID
 */
export async function importLeadsFromSheets(accessToken: string, spreadsheetInput: string, range: string = 'Sheet1!A1:H200') {
  const spreadsheetId = extractSpreadsheetId(spreadsheetInput);
  if (!spreadsheetId) {
    throw new Error('Could not parse a valid Spreadsheet ID or URL.');
  }

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch spreadsheet values. Verify that the file sharing permissions allow access or re-authenticate.');
  }

  const { values } = await response.json();
  if (!values || values.length === 0) {
    throw new Error('Spreadsheet contains zero records.');
  }

  const headers = values[0].map((h: string) => h.toLowerCase().trim());
  const rows = values.slice(1);

  // Auto-align rows with basic header names
  return rows.map((row: any[]) => {
    const mapVal = (keys: string[]) => {
      const idx = headers.findIndex((h: string) => keys.some(k => h.includes(k)));
      return idx !== -1 ? row[idx] || '' : '';
    };

    return {
      company: mapVal(['company', 'business', 'org']),
      name: mapVal(['name', 'contact', 'person', 'lead']),
      email: mapVal(['email', 'mail', 'address']),
      website: mapVal(['website', 'site', 'url', 'domain']),
      industry: mapVal(['industry', 'sector', 'field', 'niche']),
      status: 'NEW' as const
    };
  });
}
