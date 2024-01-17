import React from "react";
import ContactItem from "./ContactItem";
function Contact() {
    return (
        <div class="flex flex-col p-4 relative items-center justify-center bg-gray-300 border border-gray-800 shadow-lg  rounded-2xl">
           <ContactItem></ContactItem>
           <ContactItem></ContactItem>
        </div>
    );
}

export default Contact;