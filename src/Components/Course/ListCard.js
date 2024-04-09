import React, { useEffect, useState } from "react";
import CardCourse from './CardCourse';
import { collection, getDocs, query, where} from "firebase/firestore";
import { db } from "../../firebase";
function ListCard() {
    const [Course,setCourse]= useState([]);
    useEffect(()=>{
        const unSub = async () =>{
            const c=[];
            const q= query(collection(db,"course"),where("isPublic","==",true));
            const data= await getDocs(q);
            data.forEach((index)=>{
                c.push(index.data());
            })
            setCourse(c);
        }
        return () => {
            unSub();
        };
    },[])
    return (
        <div>
            <h1 style={{textAlign: "center"}}>Xin chào tất cả các bạn</h1>
            <div class=" flex min-h-screen flex-col overflow-hidden bg-gray">
                <div class="mx-auto max-w-screen-xl px-4 w-full">
                    <h2 class="mb-4 font-bold text-xl text-gray-600">Tất cả các khóa học sẽ được hiển thị ở đây</h2>
                    <div class="grid w-full sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {
                            Course && Course.map((index) => (
                                <CardCourse course={index}></CardCourse>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListCard;