module.exports = {
  apps: [
    {
      name: 'RealEstateFrontEnd',
      port: '3003',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    },
    {
      name: 'webhook-front-end-real-estate',
      script: './webhook.js'
    }
  ]
}
