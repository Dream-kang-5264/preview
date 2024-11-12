

type FetchConfig = {
  method: string,
  data: {
    [key: string]: string | number | object
  },
  headers: {
    [key: string]: string
  }
}


 async function SSEFetch(url: string, config: FetchConfig) {

  let arr: any[] = [];
  const text = await fetch(url, {
    method: config.method || "GET",
    headers: config.headers,
    body: JSON.stringify(config.data),
  });
  let reader = await text.body?.getReader();
  let textDecoder = new TextDecoder();
  let src: string | string[] = '';
  while (1) {
    let read = await reader?.read();
    if (read?.done) {
      console.log("读取结束");
      break;
    }
    // console.log(read?.value, "value");

    src += (textDecoder.decode(read?.value))
    src = src.split('\n')

    src.forEach(s => {
      if (s.startsWith('data')) {
        // console.log(s);
        try {
          let a = JSON.parse(s.substring(5));
          arr.push(decodeURIComponent(a.answer));
        } catch (err) {
          console.log("Error: ", err);
        }
      }
    })
    return arr
  }

}

export  {
  SSEFetch,
}