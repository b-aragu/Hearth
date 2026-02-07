// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Hello from Functions!")

interface WebhookPayload {
    type: 'INSERT' | 'UPDATE' | 'DELETE'
    table: string
    record: any
    schema: string
    old_record: null | any
}

serve(async (req) => {
    const payload: WebhookPayload = await req.json()
    console.log(payload)

    // Only handle INSERT events
    if (payload.type !== 'INSERT') {
        return new Response('Ignored', { status: 200 })
    }

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { table, record } = payload

    let title = "Hearth"
    let body = "You have a new update!"
    let data = { url: 'hearth://' }
    let recipientId = null

    // Determine recipient and message content based on table
    if (table === 'messages') {
        // Message: Send to partner. record.couple_id -> find partner
        // But simpler: record.recipient_id if we had it. We don't.
        // We have sender_id and couple_id.
        // We need to fetch the COUPLE to find the other partner.

        const { data: couple } = await supabase
            .from('couples')
            .select('partner1_id, partner2_id')
            .eq('id', record.couple_id)
            .single()

        if (!couple) return new Response('Couple not found', { status: 404 })

        // Identify recipient (the one who is NOT the sender)
        recipientId = (couple.partner1_id === record.sender_id) ? couple.partner2_id : couple.partner1_id;

        // Get Sender Name
        const { data: sender } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', record.sender_id)
            .single()

        const senderName = sender?.display_name || "Partner";

        title = `New Message from ${senderName}`
        body = record.content || "Sent a message"
        data = { url: 'hearth://chat' } // Deep link to chat

    } else if (table === 'surprises') {
        const { data: couple } = await supabase
            .from('couples')
            .select('partner1_id, partner2_id')
            .eq('id', record.couple_id)
            .single()

        if (!couple) return new Response('Couple not found', { status: 404 })

        recipientId = (couple.partner1_id === record.sender_id) ? couple.partner2_id : couple.partner1_id;

        const { data: sender } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', record.sender_id)
            .single()

        const senderName = sender?.display_name || "Partner";

        title = `Surprise from ${senderName}!`
        body = record.message || "Sent you a surprise!"
        data = { url: 'hearth://surprise' } // Deep link to surprise
    } else {
        return new Response('Table not handled', { status: 200 })
    }

    if (!recipientId) return new Response('No recipient', { status: 200 })

    // valid recipient, fetch their push token
    const { data: recipientProfile } = await supabase
        .from('profiles')
        .select('push_token')
        .eq('id', recipientId)
        .single()

    if (!recipientProfile?.push_token) {
        console.log('No push token for user', recipientId)
        return new Response('No push token', { status: 200 })
    }

    // Send Push Notification via Expo
    const message = {
        to: recipientProfile.push_token,
        sound: 'default',
        title: title,
        body: body,
        data: data,
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    return new Response(
        JSON.stringify(message),
        { headers: { "Content-Type": "application/json" } },
    )
})
