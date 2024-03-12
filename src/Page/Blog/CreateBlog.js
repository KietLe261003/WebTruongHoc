import React from "react";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const editorConfiguration = {
    toolbar: {
        items: [
            'undo', 'redo',
            '|', 'heading',
            '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
            '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
            '-', // break point
            '|', 'alignment',
            'link', 'uploadImage', 'blockQuote', 'codeBlock',
            '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
        ],
        shouldNotGroupWhenFull: true
    }
};
function CreateBlog() {
    return (
        <div class="bg-white shadow p-4 py-8" x-data="{ images: [] }">
            <div class="heading text-center font-bold text-2xl m-5 text-gray-800 bg-white">New Post</div>
            <CKEditor
                editor={Editor}
                config={editorConfiguration}
                data="<p>Hello from CKEditor&nbsp;5!</p>"
                onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(event) => {
                    console.log(event);
                }}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }}
            />
        </div>
    );
}

export default CreateBlog;