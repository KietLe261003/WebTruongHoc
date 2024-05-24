import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboard, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
function RoadMapUser(props) {
    const { currentUser } = useContext(AuthContext);
    const ac = props.active;
    const IdCourse = props.IdCourse;
    const IdRoadMap = props.IdRoadMap;
    const nameRoadMap = props.nameRoadMap;
    const descriptionRoadMap = props.descriptionRoadMap;
    const currentActive=props.currentActive;


    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [active, setActive] = useState(null);
    const [checkApply,setCheckApply]=useState(false);
    
    const navigate = useNavigate();
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };
    useEffect(() => {
        const getActive = async () => {
            const dt = [];
            try {
                //Lấy người dùng
                const docSnap = await getDoc(doc(db, "users", currentUser.uid));
                const idUser = docSnap.data().id;
                // Kiểm tra xem khứa này đăng ký học hay chưa
                const ref = collection(db, "listCourseUser");
                const q1 = query(ref, where("IdUser", "==", idUser), where("IdCourse", "==", IdCourse));
                const docCheck = await getDocs(q1);
                if (!docCheck.empty) {
                    setCheckApply(true);
                    for (const it of ac) {
                        var doc1 = it.data();
                        console.log("active: " + doc.nameActive);
                            const q = query(collection(db, "detailActive"), where("IdActive", "==", it.data().id), where("IdUser", "==", idUser));
                            const docSnap = await getDocs(q);
                            if (!docSnap.empty) {
                                doc1.pass = docSnap.docs[0].data().pass;
                            } else {
                                doc1.pass = false;
                            }
                        dt.push(doc1);
                    }
                }
                else
                {
                    await Promise.all(ac.map(async (it) => {
                        var doc = it.data();
                        dt.push(doc);
                    }));
                }
                dt.sort((a,b)=>a.timeCreate-b.timeCreate);
                setActive(dt);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu hoạt động:", error);
            }
        }; 
        if (IdRoadMap !== null && currentUser !== null && IdCourse !== null) {
            getActive();
        }
    }, [IdRoadMap, currentUser, IdCourse,ac,currentActive,navigate]);
    useEffect(() => {
        if (currentActive && ac.find(it=>it.data().idRoadMap===IdRoadMap && it.id===currentActive)) {
            setDropdownOpen(true);
        }
    }, [currentActive, ac,active,IdRoadMap]);
    const handleClick = (idActive) => {
        navigate(`/learing/${idActive}/${IdCourse}`);
        window.location.reload();
    };
    return (
        IdRoadMap && active &&
        <div class="flex flex-col rounde-lg mb-2">
            <button
                id="dropdownDefaultButton"
                data-dropdown-toggle="dropdown"
                onClick={toggleDropdown}
                type="button"
                class="flex items-center justify-between w-full p-2 lg:rounded-full md:rounded-full hover:bg-green-500 cursor-pointer border-2 rounded-lg bg-white">
                <div class="lg:flex md:flex items-center">
                    <FontAwesomeIcon class="h-5 w-12 lg:mb-0 md:mb-0 m-3" icon={faChalkboard} />
                    <div class="flex flex-col">
                        <div class="flex justify-start text-xl mb-2 leading-6 text-gray-700 font-bold w-full ">{nameRoadMap}</div>
                        <div class="text-sm text-gray-600 w-full te">{descriptionRoadMap}</div>
                    </div>
                </div>
                <FontAwesomeIcon class="h-5 w-6 mr-4" icon={faChevronRight} />
            </button>
            <div id="dropdown" class={`${isDropdownOpen ? "" : "hidden"} flex flex-col pl-5`}>
                <ul class="flex flex-col  p-2  rounde-lg" aria-labelledby="dropdownDefaultButton">
                    {
                        active.map((it, index) => (
                            it.idRoadMap===IdRoadMap ?
                            checkApply===false ? 
                            <li
                                className="flex items-center justify-between w-full p-2 lg:rounded-full md:rounded-full border-white
                cursor-pointer border-2 rounded-lg disabled} mb-2"
                            >
                                <div className=" block px-4 py- dark:hover:bg-gray-600 dark:hover:text-white text-black">
                                    {it.nameActive}
                                </div>
                            </li> :
                            <li
                                onClick={() => it.pass === true || (index > 0 && active[index - 1].pass === true) || index===0 ? handleClick(it.id) : null}
                                className={`flex items-center justify-between w-full p-2 lg:rounded-full md:rounded-full mb-2
                cursor-pointer border-2 rounded-lg ${it.pass === true || (index > 0 && active[index - 1].pass === true) || index===0 ? 'bg-white' : 'disabled border-white'}`}
                            >
                                <div className="block px-4 py- dark:hover:bg-gray-600 dark:hover:text-white text-black">
                                    {it.nameActive}
                                </div>
                            </li> :
                            <div></div>
                        )) 
                    }
                </ul>
            </div>      
        </div>
    );
}

export default RoadMapUser;