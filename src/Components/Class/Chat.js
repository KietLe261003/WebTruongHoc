import React from "react";
import { useEffect } from "react";
function Chat() {
    useEffect(() => {
        scrollToBottom();
    }, []); // Chỉ gọi một lần sau khi component được render

    function scrollToBottom() {
        var container = document.getElementById("body-message");
        container.scrollTop = container.scrollHeight;
    }

    return (
        <div class="flex-1 h-full">
            <div class="overflow-auto p-4 pb-36" id="body-message" style={{ height: 600 }}>
                <div class="flex mb-4 cursor-pointer">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                    <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                        <p class="text-gray-700">Hey Bob, how's it going?</p>
                    </div>
                </div>

                <div class="flex justify-end mb-4 cursor-pointer">
                    <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                        <p>Hi Alice! I'm good, just finished a great book. How about you?</p>
                    </div>
                    <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                </div>

                <div class="flex mb-4 cursor-pointer">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                    <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                        <p class="text-gray-700">That book sounds interesting! What's it about?</p>
                    </div>
                </div>

                <div class="flex justify-end mb-4 cursor-pointer">
                    <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                        <p>It's about an astronaut stranded on Mars, trying to survive. Gripping stuff!</p>
                    </div>
                    <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                </div>

                <div class="flex mb-4 cursor-pointer">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                    <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                        <p class="text-gray-700">I'm intrigued! Maybe I'll borrow it from you when you're done?</p>
                    </div>
                </div>

                <div class="flex justify-end mb-4 cursor-pointer">
                    <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                        <p>Of course! I'll drop it off at your place tomorrow.</p>
                    </div>
                    <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                </div>

                <div class="flex mb-4 cursor-pointer">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                    <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                        <p class="text-gray-700">Thanks, you're the best!</p>
                    </div>
                </div>


                <div class="flex justify-end mb-4 cursor-pointer">
                    <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                        <p>Anytime! Let me know how you like it. 😊</p>
                    </div>
                    <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                </div>

                <div class="flex mb-4 cursor-pointer">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                    <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                        <p class="text-gray-700">So, pizza next week, right?</p>
                    </div>
                </div>


                <div class="flex justify-end mb-4 cursor-pointer">
                    <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                        <p>Absolutely! Can't wait for our pizza date. 🍕</p>
                    </div>
                    <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                </div>

                <div class="flex mb-4 cursor-pointer">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" class="w-8 h-8 rounded-full" />
                    </div>
                    <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                        <p class="text-gray-700">Hoorayy!!</p>
                    </div>
                </div>

            </div>
            <div class="bg-white border-t border-gray-300 p-4 absolute bottom-2 w-[85%]">
                <div class="flex items-center">
                    <input type="text" placeholder="Type a message..." class="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500" />
                    <button class="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2">Send</button>
                </div>
            </div>
        </div>);
}

export default Chat;