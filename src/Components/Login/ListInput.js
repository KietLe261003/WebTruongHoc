import React, { useState } from "react";
import InputItem from "./Inputitem";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth,db,storage } from "../../firebase.js";
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc} from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
function ListInput() {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const birthDate = e.target[3].value;
        const address = e.target[4].value;
        const file = e.target[5].files[0];
        try {
             
            const res = await createUserWithEmailAndPassword(auth, email, password);
            console.log(res);
            const date= Date.now();
            const storageRef = ref(storage,`${displayName + date}` );
            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                  try {
                    //Update profile
                    await updateProfile(res.user, {
                      displayName,
                      photoURL: downloadURL,
                    });
                    //create user on firestore
                    await setDoc(doc(db, "users", res.user.uid), {
                      uid: res.user.uid,
                      id: res.user.uid,
                      displayName,
                      email,
                      photoURL: downloadURL,
                      password: password,
                      birthDate: birthDate,
                      address: address,
                      isActive: true,
                      cources: [],
                      blog: [],
                      class: [],
                      role: "user",
                    });
                    //create empty user chats on firestore
                    await setDoc(doc(db, "userChats", res.user.uid), {});
                    navigate("/");
                  } catch (err) {
                    console.log(err);
                    setErr(true);
                  }
                });
              });
        } catch (error) {
            console.log(error);
            setErr(true);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <InputItem type="text" label="Name" />
            <InputItem type="email" label="Email" />
            <InputItem type="password" label="Password" />
            <InputItem type="date" label="Ngày sinh"/>
            <InputItem type="text" label="Địa chỉ" />
            <input type="file" id="file" name="file" placeholder="Charger votre fichier" class="peer block w-full appearance-none border-none py-2.5 px-0 text-sm text-white-900 focus:border-blue-600 focus:outline-none focus:ring-0" />
            {err && <span>Sai email hoặc email không tồn tại</span>}
            <button class="btn btn-outline-light btn-lg px-5" type="submit">Đăng ký</button>
        </form>
    );
}

export default ListInput;