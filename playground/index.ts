import { gateway } from '../src'
import type { ElasticPathConfigOptions } from '../src'

const buildOptions = (): ElasticPathConfigOptions => {
  const options: ElasticPathConfigOptions = {}

  if (process.env.EP_CLIENT_ID) {
    options.client_id = process.env.EP_CLIENT_ID
  }

  if (process.env.EP_CLIENT_SECRET) {
    options.client_secret = process.env.EP_CLIENT_SECRET
  }

  if (process.env.EP_HOST) {
    options.host = process.env.EP_HOST
  }

  if (process.env.EP_BETA_FEATURES) {
    options.headers = {
      'EP-Beta-Features': process.env.EP_BETA_FEATURES
    }
  }

  return options
}

async function main(): Promise<void> {
  const client = gateway(buildOptions())
  const liveMode = process.env.EP_RUN_LIVE === 'true'
  const apiPath = process.env.EP_API_PATH ?? '/products'

  console.log('Resolved client configuration:')
  console.log(
    JSON.stringify(
      {
        baseUrl: client.config.baseUrl,
        clientIdConfigured: Boolean(client.config.clientId),
        liveMode,
        apiPath
      },
      null,
      2
    )
  )

  if (!liveMode) {
    console.log(
      'Dry run complete. Set EP_RUN_LIVE=true to send a live request.'
    )
    return
  }

  const response = await client.request.send(apiPath, 'GET')

  console.log(`Response from ${apiPath}:`)
  console.log(JSON.stringify(response, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
