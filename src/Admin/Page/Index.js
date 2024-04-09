import React, { useContext, useEffect, useState } from "react";
import NavBarAdmin from "../Components/NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import './Index.css';
import { AuthContext } from "../../context/AuthContext";
import { doc, getDoc} from "firebase/firestore";
import { db } from "../../firebase";



function Index() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [check, setCheck] = useState(null);
    useEffect(() => {
        const getUser = async () => {
            try {
                const docRef = doc(db, "users", currentUser.uid);
                const it = await getDoc(docRef);
                if(it.exists())
                {
                    console.log(it.data());
                    if(it.data().role!=="admin" && it.data().role!=="teacher")
                    {
                        navigate("/");
                    }
                    else 
                    {
                        setCheck(it.data().role);
                    }
                }
                else
                {
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
            }

        }
        return () => {
            getUser();
        }
    }, [currentUser, navigate, check])
    return (
        check!==null &&
        <div class="flex min-h-screen">
            <NavBarAdmin role={check} />
            <div class="flex flex-col w-full">
                <header class="text-white bg-blue-400 sticky left-auto top-0 right-0">
                    <div class="h-12 px-6 flex relative items-center justify-end">
                        <button class="flex mx-4 text-white hover:text-gray-200 focus:outline-none">
                            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                </path>
                            </svg>
                        </button>

                        <button class="relative block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none">
                            <img class="h-full w-full object-cover" src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" />
                        </button>
                    </div>
                </header>

                <div class="text-white bg-blue-400 flex flex-shrink-0 flex-col">
                    <div class="flex relative items-center p-4 h-12">
                        <span class="text-2xl tracking-wide">Authentication</span>
                    </div>
                </div>

                <div class="text-white bg-blue-400 flex w-full">
                    <div class="flex overflow-hidden h-12 ml-2">
                        Quản lý
                    </div>
                </div>
                <div class="w-full p-4">
                    <main role="main" class="w-full flex flex-col h-screen content-center">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Index;