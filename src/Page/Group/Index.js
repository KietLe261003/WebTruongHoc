import React, { useRef } from 'react';
//import ListGroup from '../../Components/Group/ListGroup';
import emailjs from '@emailjs/browser';
function Group() {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm('service_8vqpeod', 'template_uqhpzav', form.current, {
                publicKey: 'G8u7WveoEPjHb7bPA',
            })
            .then(
                () => {
                    console.log('SUCCESS!');
                },
                (error) => {
                    console.log('FAILED...', error.text);
                },
            );
    };
    return (
        <div>
            <form ref={form} onSubmit={sendEmail}>
                <label>Name</label>
                <input type="text" name="user_name" />
                <label>Email</label>
                <input type="email" name="user_email" />
                <label>Message</label>
                <textarea name="message"/>
                {/* <label>Id Course</label> */}
                <input type="text" name="idCourse" />
                <input type="submit" value="Send" />
            </form>
        </div>
    );
}

export default Group;