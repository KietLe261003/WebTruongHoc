import { collection, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import TableDetailCertificate from "../../Components/TableDetailCertificate";
function DetailCertificate() {
    const { idCourse } = useParams();
    const [certificateUser, setCertificateUser] = useState(null);
    const [active,setActive]=useState(null);
    useEffect(() => {

        const unsub = onSnapshot(doc(db, "certificate", idCourse), (doc) => {
            setCertificateUser(doc.data().users);
        });
        const getRoadMap = async () => {
            const rm = [];
            const ac = [];
            const q = query(collection(db, "courseRoadMap"), where("IdCourse", "==", idCourse));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                rm.push(doc.data());
                const activeQ = query(collection(db, "active"), where("idRoadMap", "==", doc.data().IdRoadMap),where("type","==",2));
                const getActive = await getDocs(activeQ);
                const ac1=[];
                getActive.forEach((it) => {
                    ac1.push(it);
                })
                ac1.sort((a, b) => {
                    const timeA = a.data().timeCreate;
                    const timeB = b.data().timeCreate;
                    if (timeA.seconds < timeB.seconds) {
                        return -1;
                    } else if (timeA.seconds > timeB.seconds) {
                        return 1;
                    } else {
                        return timeA.nanoseconds - timeB.nanoseconds;
                    }
                });
                ac1.forEach((i)=>{
                    ac.push(i);
                })
            });
            setActive(ac);
        }
        getRoadMap();
        return () => {
            unsub();
        }
    }, [idCourse])
    return (
        <div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div class="bg-slate-50 p-5 m-2 rounded-md flex justify-between items-center shadow">
                    <div>
                        <h3 class="font-bold">Số người đăng ký khóa học</h3>
                        <p class="text-gray-500">100</p>
                    </div>
                    <i class="fa-solid fa-users p-4 bg-gray-200 rounded-md"></i>
                </div>

                <div class="bg-slate-50 p-5 m-2 flex justify-between items-center shadow">
                    <div>
                        <h3 class="font-bold">Số chứng chỉ đã cấp</h3>
                        <p class="text-gray-500">65</p>
                    </div>
                    <i class="fa-solid fa-users p-4 bg-green-200 rounded-md"></i>
                </div>

                <div class="bg-slate-50 p-5 m-2 flex justify-between items-center shadow">
                    <div>
                        <h3 class="font-bold">Số chứng chỉ chờ xét duyệt</h3>
                        <p class="text-gray-500">30</p>
                    </div>
                    <i class="fa-solid fa-users p-4 bg-yellow-200 rounded-md"></i>
                </div>
            </div>
            {
                certificateUser && active && <TableDetailCertificate certificateUser={certificateUser} activeType2={active} idCourse={idCourse}/>
            }
        </div>
    );
}

export default DetailCertificate;