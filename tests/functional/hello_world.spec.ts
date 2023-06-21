import { test } from '@japa/runner'

test('display welcome page', async ({ client }) => {
  const response = await client.get('/')

  response.assertStatus(200)
  response.assertBodyContains({
    status_code: 200,
    status: 'Success',
    message: `Welcome to the KOLO BANK API`,
  })
})
