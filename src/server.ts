import express, { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const filePath = path.resolve(__dirname, '../lang/script.py')
const app = express()
console.log(filePath)
app.use(express.json())

app.post('/execute', (req: Request, res: Response) => {
  const { code } = req.body
  fs.writeFile(filePath, code, (error) => {
    if (error) {
      console.error('Error:', error)
    }
    else {
      try {
        const pyProg = spawn('python', [filePath])
        pyProg.stdout.on('data', (data) => {
          console.log(data.toString())
          res.write(data)
          res.end()
        })
        pyProg.stderr.on('data', (data) => {
          console.log(data.toString())
          res.write(data)
          res.end()
        })
      }
      catch (error) {
        console.error("Error:", error)
      }
    }
  })
})

export default app
