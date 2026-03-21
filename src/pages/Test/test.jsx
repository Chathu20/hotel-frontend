import { useState } from "react";
import uploadMedia from "../../utils/mediaUpload";

export default function TestComponent() {

    const [file, setFile] = useState(null);

    return (
        <div className="w-full h-[100vh] flex justify-center items-center flex-col gap-4">
            
            <input 
                type="file" 
                onChange={(e) => {
                    setFile(e.target.files[0]);
                }}
            />

            <button onClick={() => {
                console.log(file);
                uploadMedia(file);
            }}>
                Submit
            </button>

        </div>
    );
}