import React from "react";

function CardCourseOutline() {
    return (<div style={{marginBottom: '55px'}}>
        <h1 style={{ marginBottom: '25px', color: 'black', fontSize: '2rem', fontWeight: 900 }}>1: Tìm Hiểu Về Ngành It</h1>
        <p style={{ marginBottom: '20px', color: 'black', fontSize: '1rem', fontWeight: 600 }}>Khóa học cơ bản cho font-end</p>
        <div class="px-4 bg-white mb-8 py-8 rounded-3xl mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
            <div class="flex flex-col items-center justify-between w-full mb-10 lg:flex-row">

                <img alt="logo" width="300" height="120" src="https://cdn.dribbble.com/userupload/2338354/file/original-ae1855a82a249b8522e6d62be6351828.png?resize=752x" />

                <div class="mb-16 lg:mb-0 lg:max-w-lg lg:pr-5">

                    <div class="max-w-xl mb-6">

                        <h2 class="font-sans text-3xl sm:mt-0 mt-6 font-medium tracking-tight text-black sm:text-4xl sm:leading-none max-w-lg mb-6">
                            Jobs
                        </h2>
                        <p class="text-black text-base md:text-lg">Lorem Ipsum is so cool and awesome to act and so cool to think. And very awesome to eat and talk.

                        </p>
                    </div>
                    <div className='space-x-4'>
                        <button class="text-neutral-800  text-lg font-medium inline-flex items-center">
                            <span> see jobs →</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default CardCourseOutline;