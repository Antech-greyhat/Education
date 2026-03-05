export async function dataSubmit(details, url) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.msg) ;
      error.data = data;
      throw error;
    }

    return data; // RETURNS ANY DATA SENT BACK
    
  } catch (error) {
    console.error('Error submitting data:', error);
    throw error;
  }
}