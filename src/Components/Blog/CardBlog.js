import React from "react";

function CardBlog() {
    return (
        <div class="px-4 bg-white mb-8 py-8 rounded-3xl mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 ">
            <div class="flex flex-col items-center justify-between w-full mb-10 lg:flex-row">
                <div class="mb-16 lg:mb-0 lg:max-w-lg lg:pr-5">
                    <div class="max-w-xl mb-6">

                        <h2 class="font-sans text-3xl sm:mt-0 mt-6 font-medium tracking-tight text-black sm:text-4xl sm:leading-none max-w-lg mb-6">
                            Smart links
                        </h2>
                        <p class="text-black text-base md:text-lg">Lorem Ipsum is so cool and awesome to act and so cool to think. And very awesome to eat and talk.
                        </p>
                    </div>
                    <div className='space-x-4'>
                        <button class="text-neutral-800  text-lg font-medium inline-flex items-center">
                            <span> get insights →</span>
                        </button>
                    </div>
                </div>
                <img alt="logo" width="420" height="120" src="https://cdn.dribbble.com/userupload/2338354/file/original-ae1855a82a249b8522e6d62be6351828.png?resize=752x" />
            </div>
            <figcaption class="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-gray-900/10 px-6 py-4 sm:flex-nowrap">
                <img class="h-10 w-10 flex-none rounded-full bg-gray-50" src="https://tse2.mm.bing.net/th?id=OIP.EH_-hftMI3BNI4qNDpUkbwHaHa&pid=Api&P=0&h=180" alt="" />
                <div class="flex-auto">
                    <div class="font-semibold">Lê Tuấn Kiệt</div>
                    <span>4h trước</span>
                </div>
                <div class="flex items-center justify-between text-gray-500">
						<div class="flex items-center space-x-2">
							<button class="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
								<svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
									<path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
								</svg>
								<span>42 Likes</span>
							</button>
						</div>
						<button class="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
							<svg width="22px" height="22px" viewBox="0 0 24 24" class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
								<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
								<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
								<g id="SVGRepo_iconCarrier">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"></path>
								</g>
							</svg>
							<span>3 Comment</span>
						</button>
					</div>
            </figcaption>
        </div>
    );
}

export default CardBlog;