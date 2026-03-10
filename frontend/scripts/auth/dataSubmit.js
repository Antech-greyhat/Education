export async function dataSubmit(details, url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
      signal: controller.signal
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.msg);
      error.data = data;
      error.status = response.status;
      throw error;
    }

    return data;

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Server is waking up, please try again in a moment...');
    }
    console.error('Error submitting data:', error);
    throw error;

  } finally {
    clearTimeout(timer);
  }
}
