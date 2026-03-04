// claude
import { json } from '@sveltejs/kit'
import type { NinjaResponse } from '$lib/utils/fetchNinja';
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  const league = url.searchParams.get('league')
  
  if (!league) {
    return json({ error: 'League parameter required' }, { status: 400 })
  }
  
  try {
    const arrTypes = ["Currency", "Omen"]
    const arrRes = await Promise.all(
        arrTypes.map(type => fetch(`https://poe.ninja/poe1/api/economy/exchange/current/overview?league=${league}&type=${type}`))
    )

    const arrInfo: NinjaResponse[] = await Promise.all(
        arrRes.map(res => res.json())
    )

    const costsAndItems: NinjaResponse = {
        core: arrInfo[0].core,
        lines: arrInfo.flatMap(info => info.lines),
        items: arrInfo.flatMap(info => info.items),
    }

    return json(costsAndItems)
  } catch (error) {
    console.error('Ninja API error:', error)
    return json({ error: 'Failed to fetch data' }, { status: 500 })
  }
};