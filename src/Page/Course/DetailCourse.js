import {  collection, doc, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db} from '../../firebase';
import InforCourse from '../../Components/Course/InforCourse';
import RoadMapUser from '../../Components/Course/RoadMapUser';

const DetailCourse = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [roadMap, setRoadMap] = useState([]);
    const [rmFirst, setRmFirst] = useState(null);
    const [active, setActive] = useState([]);
    const [teacher,setTeacher]=useState(null);
    const [err,setErr] =useState(false);
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "course", id), async (doc) => {
            if (doc.exists()) {
                setCourse(doc.data());
            }
            else {
                console.log("Course not found");
            }
            const q = query(collection(db,"users"),where("id","==",doc.data().teacher),limit(1));
            const t = await getDocs(q);
            if(!t.empty)
            {
                setTeacher(t.docs[0].data());
            }
            else 
            {
                setErr(true);
            }
        })
        const getRoadMap = async () => {
            const rm = [];
            const ac = [];
            const q = query(collection(db, "courseRoadMap"), where("IdCourse", "==", id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                rm.push(doc.data());
                const activeQ = query(collection(db, "active"), where("idRoadMap", "==", doc.data().IdRoadMap));
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
            rm.sort((a,b)=>a.timeCreate-b.timeCreate);
            setActive(ac);
            if (rm.length > 0)
                setRmFirst(rm[0].IdRoadMap)
            setRoadMap(rm);
        }
        getRoadMap();
        return () => {
            unsub();
        }
    }, [id])
    return (
        <div>
            <div class="md:flex items-start justify-between py-12 ">
                <div class="xl:w-4/6 lg:w-2/5 w-80 md:block hidden">
                    {
                        course && <img alt="" src={course.photoURL} />
                    }
                </div>
                {
                    course && <InforCourse course={course} idRoadMap={rmFirst} />
                }
            </div>
            <div style={{ paddingLeft: 100, paddingRight: 100, padding: 50, backgroundColor: "#CFE9D0" }}>
                <div style={{ marginBottom: 30 }}>
                    <p style={{ fontSize: 45, fontWeight: 'bold', color: 'black' }}>Chương trình học</p>
                    <p style={{ fontSize: 12, fontWeight: 'bold', color: 'black' }}>Xem trước chương trình học</p>
                    <p style={{ fontSize: 12, fontWeight: 'bold', color: 'black' }}>Khóa học có những gì</p>
                </div>
                {roadMap && course && active &&
                    roadMap.map((index) => (
                        <RoadMapUser
                            key={index.IdRoadMap}
                            IdCourse={course.id}
                            descriptionRoadMap={index.descriptionRoadMap}
                            nameRoadMap={index.nameRoadMap}
                            IdRoadMap={index.IdRoadMap}
                            active={active}
                        />
                    ))
                }
            </div>
            {
                teacher && 
                <div style={{  paddingLeft: 100, paddingRight: 100, padding: 50, backgroundColor: "white" }}>
                    <div style={{ marginBottom: 30 }}>
                        <p style={{ fontSize: 45, fontWeight: 'bold', color: 'black' }}>Thông tin người hướng dẫn</p>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div class="grid grid-cols-1 gap-4 lg:grid-cols-1 md:grid-cols-2 lg:gap-8 h-full">
                                <div class="post p-5 lg:p-1 rounded-md">
                                    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full mb-4">
                                        <div class="relative">
                                            <img src="https://placekitten.com/500/150" alt="Banner Profile" class="w-full rounded-t-lg" />
                                            <img src={teacher.photoURL} alt="Profile"
                                                class="absolute bottom-0 left-2/4 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-white" />
                                        </div>
                                        <div class="flex items-center justify-center mt-5">
                                            <h2 class="text-xl font-bold text-gray-800">{teacher.displayName}</h2>
                                        </div>

                                        <div class="flex items-center mt-4 space-x-4">
                                            <a href="/" class="text-blue-500 hover:underline"> Twitter </a>
                                            <a href="/" class="text-blue-500 hover:underline"> GitHub </a>
                                            <a href="/" class="text-blue-500 hover:underline"> LinkedIn </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{padding: 50}}>
                                <textarea id="editor" value={course.description} disabled rows={"9"} 
                                class=" px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder=""
                                style={{resize: 'none', width: 1000, color: 'black', fontSize: 16,}}>
                                </textarea>   
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: 100, paddingRight: 100, padding: 50, backgroundColor: "black" }}>
                <div style={{ marginBottom: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ fontSize: 45, fontWeight: 'bold', marginBottom: 20, color: '#04AF2F' }}>Chứng chỉ sau khóa học</p>
                    <p style={{ fontSize: 15, fontWeight: 'bold', color: 'white', marginBottom: 10}}>
                        <span style={{fontSize: 20, color: '#04AF2F'}}>Chứng Nhận Kỹ Năng và Kiến Thức: </span>     
                        Chứng chỉ đi kèm với mô tả chi tiết về những kỹ năng và kiến thức mà người học đã đạt được. Điều này giúp người nhà tuyển dụng hoặc các bên liên quan hiểu rõ về khả năng và năng lực của người sở hữu chứng chỉ.
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 'bold', color: 'white', marginBottom: 10}}>
                        <span style={{fontSize: 20, color: '#04AF2F'}}>
                            Cung Cấp Giá Trị cho Sự Nghiệp: </span>
                        Chứng chỉ có thể tăng giá trị cho sự nghiệp của người sở hữu bằng cách chứng minh rằng họ có kỹ năng và kiến thức chuyên sâu trong một lĩnh vực cụ thể.
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 'bold', color: 'white', marginBottom: 10}}>
                        <span style={{fontSize: 20, color: '#04AF2F'}}>
                            Thúc Đẩy Tính Chuyên Nghiệp: </span>
                        Chứng chỉ được coi là một dấu hiệu của tính chuyên nghiệp và cam kết đối với sự học tập liên tục. Nó có thể giúp người sở hữu tạo ra ấn tượng tích cực khi xin việc hoặc tham gia vào các dự án chuyên nghiệp.
                    </p>
                </div>
                <div style={{marginLeft: 50}}>
                    <img style={{width: 2000, height: 600}} src='https://firebasestorage.googleapis.com/v0/b/testdata-1f2fb.appspot.com/o/White%20Simple%20Certificate%20of%20Appreciation%20(1).png?alt=media&token=d9f1587c-a63e-42d3-b122-50d6d0fe5367' alt='cretificate'/>
                </div>
            </div>
            <div style={{ height: 200 }}> {err && <span>Lỗi</span>} </div>
        </div>
    );
};

export default DetailCourse;
