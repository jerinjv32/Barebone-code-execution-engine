import express, { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const filePath = path.resolve(__dirname, '../lang/script.py')
const app = express()
app.use(express.json())

app.post('/execute', (req: Request, res: Response) => {
  const { code, input } = req.body
  let newInput = input.replaceAll(',', '\n')

  fs.writeFile(filePath, code, (error) => {
    if (error) {
      console.error('Error:', error)
    }
    else {
      try {
        const pyProg = spawn('python', [filePath])

        const timeOut = setTimeout(() => {
          pyProg.kill("SIGKILL")
          console.log('Execution stopped. Timeout')
        }, 10000)


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

        pyProg.on('close', (code) => {
          clearTimeout(timeOut)
          console.log('Program exited with code:', code);
        })
        pyProg.stdin.write(newInput + '\n')
      }
      catch (error) {
        console.error("Error:", error)
      }
    }
  })
})

export default app
