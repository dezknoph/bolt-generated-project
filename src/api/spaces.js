import axios from 'axios';

const API_KEY = 'xai-HLlycriU5wjEB5Ccc0alHCbNfQNT3DNkdSc46jHSN9aojQSnTUHJFOsnaITzx3GjhILy9Hu3x4LyyM3OY';
const API_BASE_URL = 'https://api.x.ai/v1/chat/completions -H "Content-Type: application/json" -H "Authorization: Bearer xai-HLlycriU5wjEB5Ccc0alHCbNfQNT3DNkdSc46jHSN9aojQSnTUHJFOsnaITzx3GjhILy9Hu3x4LyyM3O" -d '{
  "messages": [
    {
      "role": "system",
      "content": "You are a test assistant."
    },
    {
      "role": "user",
      "content": "Testing. Just say hi and hello world and nothing else."
    }
  ],
  "model": "grok-beta",
  "stream": false,
  "temperature": 0
}'';

export const fetchSpaces = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/spaces`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch spaces data');
  }
};
