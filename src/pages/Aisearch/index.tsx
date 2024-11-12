import React, { useEffect, useState } from 'react'

function index() {
  let [subAppUrl, setSubAppUrl] = useState('')

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setSubAppUrl('http://localhost:3000')
    } else if (process.env.NODE_ENV === 'production') {
      setSubAppUrl('http://120.232.132.10:37104')
    }
    console.log(process.env.NODE_ENV, 'process');
  }, [])
  return (
    <div style={{ width: '100%', height: '100%', background: '#FEFEFE' }} >
      <iframe src={'http://120.232.132.10:37104'} width="100%" height="100%" title="子应用" ></iframe>
    </div>
  )
}

export default index



// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import React from "react";
// import AiSearch from "./AiSearch";
// import { ChatPanel } from "./components/chat-panel";

// export default function Home() {
//   const [queryClient] = React.useState(() => new QueryClient());
//   return (

//     <QueryClientProvider client={queryClient}>  <ChatPanel /></QueryClientProvider>
//     // <ChatPanel />

//   );
// }