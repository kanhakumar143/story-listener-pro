import { Song } from "@/types";
import useAuthModal from "./useAuthModal";
import usePlayer from "./usePlayer"
import { useUser } from "./useUser";
import useSubscribeModal from "./useSubscribeModal";

const useOnPlay = (songs: Song[]) => {
    const player = usePlayer();
    const authModal = useAuthModal();
    const subscribeModal = useSubscribeModal();
    const { user, subscription } = useUser();

    const onplay = (id: string) => {
        if(!user) { return authModal.onOpen(); }

        // For show subscription modal
        // if(!subscription){
        //     subscribeModal.onOpen()
        // }

        player.setId(id);
        player.setIds(songs.map((song)=> song.id));
    }

    return onplay;
  
}

export default useOnPlay