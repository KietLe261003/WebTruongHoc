import React, {  useState } from "react";
import { MDBCard, MDBCardBody, MDBCardText, MDBCol, MDBRow } from "mdb-react-ui-kit";
import { Input } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

function Contact(props) {
    const user=props.user;
    const setting=props.setting;
    const save=props.save;
    const checkSave=props.checkSave;
    const [name,setName]=useState(user.displayName!==undefined ? user.displayName : "");
    const [phone,setPhone]=useState(user.phone!==undefined ? user.phone : "");
    const [address,setAddress]=useState(user.address!==undefined ? user.address : ""); 
    
    if(save)
        {
            const saveData = async () =>{
                try {
                    await updateDoc(doc(db,"users",user.uid),{
                        displayName: name,
                        phone: phone,
                        address: address
                    })
                    checkSave();
                } catch (error) {
                    console.log("lỗi mẹ rồi");
                }
            }  
            saveData();
        }
    return (
        <MDBCard className="mb-4">
            <MDBCardBody>
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Full Name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                        {
                            setting === true ?
                                <Input type="text" className="text-muted w-full" value={name} onChange={(e) => { setName(e.target.value) }}></Input> :
                                <MDBCardText className="text-muted">{user.displayName !== undefined && user.displayName}</MDBCardText>
                        }
                    </MDBCol>
                </MDBRow>
                <hr />
                <div class="mb-3"></div>
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                        <MDBCardText className="text-muted">{user.email !== undefined && user.email}</MDBCardText>
                    </MDBCol>
                </MDBRow>
                <hr />
                <div class="mb-3"></div>
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Phone</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                        {
                            setting === true ?
                                <Input type="text" className="text-muted w-full" value={phone} onChange={(e) => { setPhone(e.target.value) }}></Input> :
                                <MDBCardText className="text-muted">{user.phone !== undefined && user.phone}</MDBCardText>
                        }
                    </MDBCol>
                </MDBRow>
                <hr />
                <div class="mb-3"></div>
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Password</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">                        
                        <MDBCardText className="text-muted">{user.password !== undefined && user.password}</MDBCardText>     
                    </MDBCol>
                </MDBRow>
                <hr />
                <div class="mb-3"></div>
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Address</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                        {
                            setting===true ?
                            <Input type="text" className="text-muted w-full" value={address} onChange={(e)=>{setAddress(e.target.value)}}></Input>:
                            <MDBCardText className="text-muted">{user.address!==undefined && user.address}</MDBCardText>
                        }
                    </MDBCol>
                </MDBRow>
                <hr />
                <div class="mb-3"></div>
                <MDBRow>
                    <MDBCol sm="3">
                        <MDBCardText>Quyền tài khoản</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                        {
                            setting===true ?
                            <Input type="text" className="text-muted w-full" disabled value={user.role}></Input>:
                            <MDBCardText className="text-muted">{user.role!==undefined && user.role}</MDBCardText>
                        }
                    </MDBCol>
                </MDBRow>
                <hr/>
            </MDBCardBody>
        </MDBCard>
    );
}

export default Contact;