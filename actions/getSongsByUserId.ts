import { Song } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { headers, cookies } from "next/headers"

const getSongsById = async () :  Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: sectionData,
        error: sectionError
    } = await supabase.auth.getSession();

    if(sectionError){
        console.log("sectionError", sectionError.message)
        return [];
    }

    const {data, error} = await supabase
        .from("songs")
        .select("*")
        .eq("user_id", sectionData.session?.user?.id)
        .order("created_at", {ascending: false});

    if(error){
        console.log(error.message)
    }

    return (data as any) || [];

}

export default getSongsById;