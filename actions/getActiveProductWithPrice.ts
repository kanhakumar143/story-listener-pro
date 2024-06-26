import { ProductWithPrice, Song } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { headers, cookies } from "next/headers"

const getActiveProductWithPrice = async () :  Promise<ProductWithPrice[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase
        .from("products")
        .select("*, prices(*)")
        .eq("active", true)
        .eq("prices.active", true )
        .order('metadata->index')
        .order('unit_amount', { foreignTable: 'prices' });

    if(error){
        console.log("error", error)
    }

    return (data as any) || []
}

export default getActiveProductWithPrice;