import { Song } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { headers, cookies } from "next/headers"
import getSong from "./getSongs";

const getSongsByTitle = async (title: string    ) :  Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    if(!title){
        const allSongs = getSong();
        return allSongs;
    }

    const {data, error} = await supabase
        .from("songs")
        .select("*")
        .ilike("title", `%${title}%`)
        .order("created_at", {ascending: false});

    if(error){
        console.log(error.message)
    }

    return (data as any) || [];

}

export default getSongsByTitle;