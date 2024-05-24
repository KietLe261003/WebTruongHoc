import { collection, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";

import RoadMap from "../../Components/RoadMap";
import DetailCourseTable from "../../Components/DetailCourseTable";
import InforTeacher from "../../Components/InforTeacher";
import CreateRoadMap from "../../Components/CreateRoadMapItemCourse";
function DetailCourse() {
    const {id}= useParams();
    const [course,setCourse] = useState(null);
    const [err,setErr] = useState(false);
    const [roadMap,setRoadMap]=useState([]);
    useEffect(()=>{
      const getRoadMap = async ()=>{
         const rm= [];
         const q= query(collection(db,"courseRoadMap"),where("IdCourse","==",id));
         const querySnapshot= await getDocs(q);
         querySnapshot.forEach((doc) => {
            rm.push(doc.data());
          });
          rm.sort((a,b)=>a.timeCreate-b.timeCreate);
         setRoadMap(rm);
      }
      const unSub= onSnapshot(doc(db,"course",id),(doc) =>{
         //console.log(doc.data());
         if (doc.exists()) {
            setCourse(doc.data());
         }
         else {
            setErr(true);
         }
      })
      getRoadMap();
      return ()=>{
         unSub();
      }
    },[id])
    return ( 
      <section class="bg-white py-20 lg:py-[120px]">
         {err && <h1>Not Found Courese</h1>}
         <div class="container">
            <div class="flex flex-wrap -mx-4">
               <div class="w-full px-4">
                  <div class="max-w-full overflow-x-auto">
                     {course && <DetailCourseTable course={course}/>}
                     {course && <InforTeacher 
                     teacher={course.teacher} 
                     description={course.description} 
                     IdCourse={course.id}/>} 
                     {course && <CreateRoadMap IdCourse={course.id}/>}
                     <div style={{margin: 20}}></div>
                     { course && 
                        roadMap.map((index)=>(
                           <RoadMap 
                              IdCourse={course.id} 
                              descriptionRoadMap={index.descriptionRoadMap} 
                              nameRoadMap={index.nameRoadMap}
                              IdRoadMap={index.IdRoadMap}
                           />
                        ))
                     }
                  </div>
               </div>
            </div>
         </div>
      </section>
     );
}

export default DetailCourse;