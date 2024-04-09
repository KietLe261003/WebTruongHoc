import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import '../../../src/Page/test.css';
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
export default function UpdateActiveDoc(props) {
    const activeUpdate=props.activeUpdate;
    const idCourse=props.idCourse;
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState();
    const [nameActive,setNameActive]=useState(activeUpdate.nameActive);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    const handleSubmit = async () => {
        if(file===null)
        {
            try {        
                const timeUpdate = Timestamp.now();
                await updateDoc(doc(db,"active",activeUpdate.id),{
                    nameActive: nameActive,
                    timeUpdate: timeUpdate
                })
                alert("Cập nhật thành công");
                    window.location.reload();
            } catch (error) {
                alert("Thao tác lỗi");
            }
        }
        else
        {
            const storageRef = ref(storage, `FileActive/${idCourse + "/" + activeUpdate.idRoadMap + "/" + activeUpdate.id}`);
            await uploadBytesResumable(storageRef, file).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
                try {
                    const timeUpdate = Timestamp.now();
                    await updateDoc(doc(db, "active", activeUpdate.id), {
                        nameActive: nameActive,
                        fileURL: downloadURL,
                        timeUpdate: timeUpdate
                    })
                    alert("Cập nhật thành công");
                    window.location.reload();
                } catch (err) {
                    console.log(err);
                }
            });
        });
        }
    }
    return (
        <div style={{ maxHeight: 600, padding: "20px" }}>
            <div class="md:col-span-2 w-full">
                        <input type="text" id="fname" value={nameActive} onChange={(e)=>{setNameActive(e.target.value)}} name="fname" placeholder="Tên hoạt động"
                            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700 "
                        />
                    </div>
            <input type="file" onChange={(e) => { setFile(e.target.files[0]) }}></input>
            <div className="pdf-div">
                {
                    file &&
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                        {Array.apply(null, Array(numPages))
                            .map((x, i) => i + 1)
                            .map((page) => {
                                return (
                                    <Page
                                        pageNumber={page}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                );
                            })}
                    </Document>
                }
            </div>
            <div class="md:col-span-2">
                <button
                    onClick={handleSubmit}
                    type="submit"
                    class="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">Tạo </button>
            </div>
        </div>
    );
}
