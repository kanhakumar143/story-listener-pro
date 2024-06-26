import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import uniqid from 'uniqid'
import toast from "react-hot-toast";
import useUploadModal from "@/hooks/useUploadModal"
import Modal from "./Modal"
import Input from "./Input";
import Button from "./Button";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
    const uploadModal = useUploadModal();
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useUser();
    const supabseClient = useSupabaseClient();
    const router = useRouter();

    const  {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues:{
            author:"",
            title:"",
            song:null,
            image:null
        }
    })

    const onChange = (open: boolean) => {
        if(!open){
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit:SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if(!imageFile || !songFile || !user){
                toast.error("Missing fields !");
                return;
            }

            const uniqueID = uniqid();

            const {
                data: songData,
                error: songError
            } = await supabseClient
            .storage
            .from('songs')
            .upload(`song-${values.title}-${uniqueID}`, songFile, {
                cacheControl:'3600',
                upsert:false
            });

            if(songError){ 
                setIsLoading(false);
                return toast.error("Failed upload song.")
            }

            const {
                data: imageData,
                error: imageError
            } = await supabseClient
                .storage
                .from('images')
                .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl:'3600',
                    upsert:false
                });

            if(imageError){ 
                setIsLoading(false);
                return toast.error("Failed upload image.")
            }

            const {
                error: supabaseError
            } = await supabseClient
                .from('songs')
                .insert({
                    user_id : user.id,
                    title: values.title,
                    author : values.author,
                    song_path: songData.path,
                    image_path: imageData.path
                });
            
            if(supabaseError){
                setIsLoading(false);
                return toast.error(supabaseError.message)
            }
            
            router.refresh();
            setIsLoading(false);
            toast.success("Song created !");
            reset();
            uploadModal.onClose();
        } catch (error) {
            toast.error("Something wants wrong !")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal 
            title="Add a story"
            description="Upload an mp3 file here"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input 
                    id='title' 
                    disabled={isLoading} 
                    {...register('title', {required:true})} 
                    placeholder={'Story Title'} 
                />

                <Input 
                    id='author' 
                    disabled={isLoading} 
                    {...register('author', {required:true})} 
                    placeholder={'Story Author'} 
                />

                <div>
                    <div className="pb-1">
                        Select a story file
                    </div>
                    <Input 
                        id='song' 
                        disabled={isLoading} 
                        type="file"
                        accept=".mp3"
                        {...register('song', {required:true})} 
                    />
                </div>

                <div>
                    <div className="pb-1">
                        Select a image 
                    </div>
                    <Input 
                        id='image' 
                        disabled={isLoading} 
                        type="file"
                        accept="image/*"
                        {...register('image', {required:true})} 
                    />
                </div>

                <Button disabled={isLoading} type="submit" >
                    Create
                </Button>
            </form>
        </Modal>
    )
}

export default UploadModal