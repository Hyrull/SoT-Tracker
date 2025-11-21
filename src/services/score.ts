const apiUrl = 'https://backend.sot-tracker.com/api'

export interface ScoreData {
username: string
success: boolean
currentScore: number
maximumScore: number
percentage: string
}

export async function getScore(token: string): Promise<ScoreData> {
const response = await fetch(`${apiUrl}/data/score`, {
method: 'GET',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
})

if (!response.ok) {
throw new Error(`Failed to fetch score: ${response.status} ${response.statusText}`)
}

const data: ScoreData = await response.json()
return data
}
