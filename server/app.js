const express = require('express')
const bodyParser = require('body-parser')
const ngrok = require('ngrok')
const axios = require('axios')
const crypto = require('crypto')
const dotenv = require('dotenv')
// import process from 'node:process';

const PORT = 3000
const app = express()
const passcode = crypto.randomBytes(48).toString('hex')

const figma_token = process.env.FIGMA_TOKEN_SNP
const team_id = process.env.FIGMA_TEAM_ID_AUTOMATION

app.use(bodyParser.json())

app.post('/', (request, response) => {
  console.log(`#New Event: ${request.body.event_type}`)
  if (request.body.passcode === passcode && request.body.event_type == 'FILE_VERSION_UPDATE') {
    const { file_name, timestamp } = request.body
    console.log(`${file_name} was updated at ${timestamp}`)
    console.log(request.body)
    response.sendStatus(200)

    axios({
      url: `https://api.figma.com/v1/files/${request.body.file_key}`,
      method: 'get',
      headers: {
        'X-FIGMA-TOKEN': figma_token
      },
    }).then(function (response) {
      console.log(`Get files response ${response.data.name}`)
    }).catch(function (error) {
      console.log(`Error ${error}`)
    })
  } else {
    response.sendStatus(403)
  }
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

webhook_id = null
ngrok_endpoint = null

ngrok.connect(PORT).then(async (endpoint) => {
  this.ngrok_endpoint = endpoint
  console.log(`print endpoint ${endpoint}`)
  axios({
    url: 'https://api.figma.com/v2/webhooks',
    method: 'post',
    headers: {
      'X-Figma-Token': figma_token
    },
    data: {
      event_type: 'FILE_VERSION_UPDATE',
      team_id: team_id,
      passcode,
      endpoint,
    },
  }).then(function (response) {
    this.webhook_id = response.data.id
    console.log(`🎣 Webhook ${response.data.id} successfully created`)
  }).catch(function (error) {
    if (error.response) {
      console.log(error.response)
    } else if (error.request) {
      console.log(error.request)
    } else {
      console.log('Error', error.message)
    }
  })
})

// process.on('beforeExit', (code) => {
//   axios({
//     url: `https://api.figma.com/v2/webhooks/${webhook_id}`,
//     method: 'delete',
//     headers: {
//       'X-Figma-Token': figma_token
//     },
//     data: {
//       event_type: 'FILE_VERSION_UPDATE',
//       ngrok_endpoint,
//     },
//   }).then(function (response) {
//     console.log(response)
//   })
//   console.log('Process beforeExit event with code: ', code);
// });