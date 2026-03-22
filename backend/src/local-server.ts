/**
 * Local development server for testing the Lambda handler
 * Usage: npx ts-node -r tsconfig-paths/register src/local-server.ts
 */
import http from 'http'
import { generateScheduleSchema } from './schemas/schedule.schema'
import { generateSchedulesWithLinks } from './services/ScheduleService'

const PORT = 3001

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  // Only handle POST /courses/generate
  if (req.method === 'POST' && req.url === '/courses/generate') {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        console.log('Received request:', JSON.stringify(data, null, 2))

        // Validate input
        const validation = generateScheduleSchema.safeParse(data)
        if (!validation.success) {
          console.error('Validation error:', validation.error.errors)
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            message: 'Invalid input data',
            errors: validation.error.errors
          }))
          return
        }

        // Generate schedules
        const schedules = generateSchedulesWithLinks(validation.data)

        const response = schedules.length === 0
          ? { success: true, message: 'Schedule conflicts', schedules: [] }
          : { success: true, schedules }

        console.log(`Generated ${schedules.length} schedule combinations`)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response))
      } catch (error) {
        console.error('Error:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Internal server error', error: String(error) }))
      }
    })
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Not found' }))
  }
})

server.listen(PORT, () => {
  console.log(`🚀 Local backend running at http://localhost:${PORT}`)
  console.log(`   POST /courses/generate - Generate schedules`)
})

