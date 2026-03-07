export async function dataSubmit(details, url) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
      signal: AbortSignal.timeout(60000) // wait up to 60 seconds
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.msg);
      error.data = data;
      throw error;
    }

    return data;

  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('Server is waking up, please try again in a moment...');
    }
    console.error('Error submitting data:', error);
    throw error;
  }
}