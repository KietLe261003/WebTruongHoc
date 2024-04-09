import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboard, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import CreateActive from "./CreateActive";
import {  collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { Button } from "flowbite-react";


import UpdateActive from "./UpdateActive";
import UpdateRoadMap from "./UpdateRoadMap";
import { deleteObject, ref } from "firebase/storage";

function RoadMap(props) {
    const IdCourse = props.IdCourse;
    const IdRoadMap = props.IdRoadMap;
    const nameRoadMap = props.nameRoadMap;
    const descriptionRoadMap = props.descriptionRoadMap;
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [roadMap, setRoadMap] = useState(null);
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const getRoadMap = async () => {
            const dt = [];
            const q = query(
                collection(db, "active"), 
                where("idRoadMap", "==", IdRoadMap));
            const rm = await getDocs(q);
            rm.forEach((it) => {
                dt.push(it.data());
            })
            dt.sort((a, b) => a.timeCreate - b.timeCreate);
            setRoadMap(dt);
        }
        return () => {
            getRoadMap();
        }
    }, [IdRoadMap])
    const handleDelete = async (id,idRoadMap) => {
        const choice = window.confirm(
            "Bạn có chắc muốn xóa hoạt động này không"
        )
        if (choice) {
            const q = doc(db, "active", id);
            const getActive=await getDoc(q);
            const qd = query(collection(db, "detailActive"), where("IdActive", "==", id));
                    const deleteDetail = await getDocs(qd);

                    // Tạo một mảng promises cho việc xóa chi tiết active
                    const deleteDetailPromises = deleteDetail.docs.map(async (item) => {
                        if(item.exists())
                        {
                            const idD=item.data().id+"";
                            try {
                                await deleteDoc(doc(db, "detailActive", idD));
                            } catch (error) {
                                alert("Lỗi xóa detail");
                                console.log(error);
                            }
                            
                        }
                    });
                    await Promise.all(deleteDetailPromises);
            await deleteDoc(q);
            if(getActive.data().type===1)
            {
                const desertRef = ref(storage, `Video/${IdCourse}/${idRoadMap}/${id}`);
                deleteObject(desertRef).then(async() => {
                    const docCourse = await getDoc(doc(db,"course",IdCourse));
                        const sumActive=docCourse.data().sumActive-1;
                        await updateDoc(doc(db,"course",IdCourse),{
                            sumActive: sumActive
                        })
                    window.location.reload();
                  }).catch((error) => {
                    alert("lỗi trong quá trình xóa");
                  });
            }
            else
            {
                window.location.reload();
            }
        }
    }
    
    return (
        <div class="flex flex-col rounde-lg mb-2">
            <button
                id="dropdownDefaultButton"
                data-dropdown-toggle="dropdown"
                onClick={toggleDropdown}
                type="button"
                class="flex items-center justify-between w-full p-2 lg:rounded-full md:rounded-full hover:bg-gray-100 cursor-pointer border-2 rounded-lg">
                <div class="lg:flex md:flex items-center">
                    <FontAwesomeIcon class="h-12 w-12 lg:mb-0 md:mb-0 m-3" icon={faChalkboard} />
                    <div class="flex flex-col">
                        <div class="flex justify-start text-xl mb-2 leading-3 text-gray-700 font-bold w-full">{nameRoadMap}</div>
                        <div class="text-sm text-gray-600 w-full te">{descriptionRoadMap}</div>
                    </div>
                </div>
                <div class="flex flex-row mr-4 justify-center items-center">
                    {
                        roadMap &&
                        <UpdateRoadMap IdCourse={IdCourse} roadMap={IdRoadMap} nameRoadMap={nameRoadMap} descriptionRoadMap={descriptionRoadMap} ></UpdateRoadMap>
                    }
                    <FontAwesomeIcon class="h-6 w-6 mr-4 ml-4" icon={faChevronRight} />
                </div>
            </button>
            <div id="dropdown" class={`${isDropdownOpen ? "" : "hidden"}  flex flex-col gap-4 lg:p-4 p-2  rounde-lg m-2`}>
                <ul class="flex flex-col gap-2 lg:p-4 p-2  rounde-lg" aria-labelledby="dropdownDefaultButton">
                    {
                        roadMap &&
                        roadMap.map((it) => (
                            <li key={it.id} class="flex items-center justify-between w-full p-2 lg:rounded-full md:rounded-full hover:bg-gray-100 cursor-pointer border-2 rounded-lg">
                                <a href="/" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{it.nameActive}</a>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <UpdateActive activeUpdate={it} IdCourse={IdCourse} nameRoadMap={nameRoadMap}></UpdateActive>
                                    <Button onClick={() => handleDelete(it.id,it.idRoadMap)} color="failure">Xóa</Button>
                                </div>
                            </li>
                        ))
                    }
                    <CreateActive IdCourse={IdCourse} IdRoadMap={IdRoadMap} nameRoadMap={nameRoadMap} />
                </ul>
            </div>
            
        </div>
    );
}

export default RoadMap;