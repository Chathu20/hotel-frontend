import app from "../config/firebase";
import { getStorage , ref, uploadBytes } from "firebase/storage";
const storage = getStorage
(app, "gs://my-custom-bucket");



export default function uploadMedia(file){
    if(file== null){
        return;
    }
    const fileRef = ref(storage, file.name);

    uploadBytes(fileRef,file).then((snapshot)=>{
        console.log("Uploaded a blob or file");
    })


}


