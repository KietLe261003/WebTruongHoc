import React from "react";
import { useState } from "react";

import Chat from "./Chat";
function NavigateClass() {
    const [openTab, setOpenTab] = useState(1);
    return (
        <div class="flex flex-col h-full overflow-auto">
            <header class="bg-white p-4 text-gray-700">
                <div style={{ display: "flex", flexDirection: "row"}}>
                    <h1 class="text-2xl font-semibold" style={{marginRight: 50}}>Logon của phòng</h1>
                        <button
                            onClick={() => setOpenTab(1)}
                            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${openTab === 1 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            Section 1
                        </button>
                        <button
                            onClick={() => setOpenTab(2)}
                            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${openTab === 2 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            Section 2
                        </button>
                        <button
                            onClick={() => setOpenTab(3)}
                            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${openTab === 3 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            Section 3
                        </button>
                        <button
                            onClick={() => setOpenTab(4)}
                            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${openTab === 4 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            Section 4
                        </button>
                        <button
                            onClick={() => setOpenTab(5)}
                            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${openTab === 5 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            Section 5
                        </button>
                    
                </div>
            </header>
            <Chat></Chat>
        </div>
    );
}

export default NavigateClass