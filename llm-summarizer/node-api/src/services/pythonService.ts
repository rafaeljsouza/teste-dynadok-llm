import axios from 'axios';

const PYTHON_SERVICE_URL = 'http://localhost:8000';

export async function generateSummary(text: string, lang: string): Promise<string> {
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/summarize`, {
            text,
            lang
        });
        return response.data.summary;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail || 'Failed to generate summary');
        }
        throw new Error('Failed to connect to Python service');
    }
}