import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";

import { stripe } from "@/libs/stripe";
import { getUrl } from "@/libs/helpers";
import { 
    createOrRetrieveCustomer
} from "@/libs/supabaseAdmin";

export async function POST(request:Request) { 
    const { price, quantity = 1, metadata = {} } = await request.json();

    try {
        const supabase = createRouteHandlerClient({
            cookies
        });

        const { data: { user } } = await supabase.auth.getUser();

        const customer = await createOrRetrieveCustomer({
            uuid: user?.id || '',
            email: user?.email || ''
        });

        const section = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            billing_address_collection: "required",
            customer,
            line_items:[
                {
                    price: price.id,
                    quantity
                }
            ],
            mode:"subscription",
            allow_promotion_codes: true,
            subscription_data: {
                metadata
            },
            success_url: `${getUrl()}/account`,
            cancel_url: `${getUrl()}`,
        })

        return NextResponse.json({sessionId: section.id})
    } catch (error: any) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}