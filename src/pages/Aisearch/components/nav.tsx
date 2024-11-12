"use client";





import { useChatStore } from "../stores";

const NewChatButton = () => {
  return (
    // <Button variant="secondary" size="sm" onClick={() => (location.href = "/")}>
    //   <PlusIcon className="w-4 h-4" />

    //   <span className="block">&nbsp;&nbsp;返回</span>
    // </Button>
    <div style={{ fontSize: '18px', fontWeight: '600', lineHeight: '32px' }} onClick={() => (location.href = "/")}>智笔写作系统</div>
  );
};

const TextLogo = () => {
  return <div style={{ fontSize: '18px', fontWeight: '600', lineHeight: '32px' }}>智笔写作系统</div>;
};

export function Navbar() {

  const { messages } = useChatStore();

  const onHomePage = messages.length === 0;

  return (
    <header className="w-full flex fixed p-1 z-50 px-2 bg-background/95 justify-between items-center" style={{ borderBottom: '1px solid #E5E5E5', backdropFilter: ' blur(1px)', background: '#fff' }}>
      <div className="flex items-center gap-2">
        {/* <Link href="/" passHref onClick={() => (location.href = "/")}> */}
        <img
          // src={theme === "light" ? "/logo-black.png" : "/logo-white.png"}
          src={'https://aiwritebeijing.oss-cn-beijing.aliyuncs.com/login.svg'}
          style={{ height: '50px', width: '50px' }}
          alt="Logo"
          className="w-12 h-12"
        />
        {/* </Link> */}
        {onHomePage ? <TextLogo /> : <NewChatButton />}


      </div>
      <div className="flex items-center gap-4">
        <a href="/history" >
          <div className="font-medium hover:underline decoration-tint underline-offset-4 transition-all duration-200 ease-in-out transform hover:scale-[1.02] text-left break-words normal-case">
            <div className="flex items-center gap-2">
              {/* <HistoryIcon className="w-4 h-4" />
              History */}
            </div>
          </div>
        </a>

        <img src={'data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjUgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwLjE5NSIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik03OTcuMDM5IDEwMjMuOTc1SDY1Ni45M2EzNi4xNjUgMzYuMTY1IDAgMCAxLTM2LjcyLTM2Ljc4VjY3Ny45NTFhMjguNDcgMjguNDcgMCAwIDAtMjguMzYtMjguNDdsLTE2Ni4wNS0uMjM0YTI4LjQ3IDI4LjQ3IDAgMCAwLTI4LjU1NyAyOC40N3YzMDguMDQ2YzAgMjAuNzg5LTIxLjA2IDM4LjIyNC00MS44MjQgMzguMjI0SDIxNy4zMjJjLTYwLjY5IDAtMTEwLjIwOC00OS41OC0xMTAuMjA4LTExMC4zNTZWNTkwLjU4aC0yMC44QTg1Ljk0MiA4NS45NDIgMCAwIDEgMCA1MDQuMjdjMC0yMi4zOTIgNy45OS00My4xNTYgMjMuOTU3LTU5LjE4NUwzOTYuMTM1IDUwLjA0OGM2MC42OS02My45NjkgMTYxLjMxNi02Ny4xNjIgMjI2LjgwMi02LjM5OWExMi40NDEgMTIuNDQxIDAgMCAwIDYuMzg3IDYuNGwzNzIuMTUgMzk1LjAxYzMzLjUzOSAzMy41ODggMzEuOTQ4IDg3Ljk2NC0xLjU5IDEyMS41NC0xNi4wMyAxNi4wMjgtMzguMzM1IDIzLjk5NC02MC42OSAyMy45OTRoLTMxLjk0N3YzMjMuMDUyYzAgNjAuNzc1LTQ5LjUwNiAxMTAuMzU1LTExMC4yMDggMTEwLjM1NXptLTEyMS41MDItNzMuNTYyIiBmaWxsPSIjRkE4QjE5Ii8+PC9zdmc+'} alt='' width={25} height={25} style={{ cursor: 'pointer' }} onClick={() => {
          // console.log(env);
          console.log(process.env.NODE_ENV);
          if (process.env.NODE_ENV === 'development') {
            window.parent.location.href = 'http://localhost:8000';
          }
          else {
            window.parent.location.href = 'http://120.232.132.10:37112';
          }


        }} />
        {/* <ModeToggle /> */}
      </div>
    </header>
  );
}
