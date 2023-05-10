import type { PageLoad } from './$types'
import { supabase } from '$lib/db'

export const load = (async () => {
    const { data, error } = await supabase
        .from('notes')
        .select()
        .order('id', { ascending: false })

    if (error)
        throw error

    return { notes: data }
}) satisfies PageLoad
