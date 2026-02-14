export async function dataSubmit(details, url) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || data.message || 'Request failed');
    }

    return data; // RETURNS ANYTHING SENT BACK
    
  } catch (error) {
    console.error('Error submitting data:', error);
    throw error;
  }
}