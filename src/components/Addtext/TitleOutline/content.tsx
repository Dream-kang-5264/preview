// import React from 'react'


// function content(props: any) {
//     let { data, } = props



//     return (
//         <>

//             <div style={{ width: '100%', height: '9vh', display: 'flex', position: 'relative' }}>
//                 <div style={{ width: '9%', paddingLeft: '1.2rem', color: '#999', paddingTop: '1.2rem', fontSize: '.8rem' }}>{data[0].description ? '标题' : '标题'}</div>
//                 <div style={{ height: '150%', position: 'relative' }}>
//                     <div style={{ border: '1px solid #ccc', width: '1px', height: '100%', }}></div>
//                     <div style={{ width: '1.2vw', border: '1px solid #ccc', position: 'absolute', top: '30%' }}>

//                     </div>
//                     <span style={{ position: 'absolute', top: '23%', right: '-1.5rem', fontSize: '.6rem', color: '#ccc' }}>○</span>

//                     <div style={{ position: 'absolute', left: '-.24rem', bottom: '-.5rem', fontSize: '1rem', color: '#ccc' }}>●</div>


//                 </div>
//                 <div style={{ flex: 1, padding: '.5rem', borderRadius: '1rem', marginLeft: '2rem', display: 'flex' }}>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', width: '80%', paddingTop: '.5rem' }}>
//                         <input type="text" value={data[0].title} style={{ fontSize: '1rem', outline: 'none', width: '100%', fontWeight: 600 }} />
//                         <input type="text" value={"2223"} style={{ outline: 'none', width: '100%' }} />
//                     </div>
//                     <div>22</div>
//                 </div>
//             </div>
//             {
//                 data[0].chapters.map((item: any, index: any) => {
//                     console.log(item, '222');

//                     return <>
//                         {
//                             item.subchapters?.map((text: any) => {
//                                 return <div style={{ width: '100%', height: '9vh', display: 'flex', position: 'relative' }}>
//                                     <div style={{ width: '9%', paddingLeft: '1.2rem', color: '#999', paddingTop: '1.2rem', fontSize: '.8rem' }}>{index}</div>
//                                     <div style={{ height: '150%', position: 'relative' }}>
//                                         <div style={{ border: '1px solid #ccc', width: '1px', height: '100%', }}></div>
//                                         <div style={{ width: '1.2vw', border: '1px solid #ccc', position: 'absolute', top: '30%' }}>

//                                         </div>
//                                         <span style={{ position: 'absolute', top: '23%', right: '-1.5rem', fontSize: '.6rem', color: '#ccc' }}>○</span>

//                                         <div style={{ position: 'absolute', left: '-.24rem', bottom: '-.5rem', fontSize: '1rem', color: '#ccc' }}>●</div>


//                                     </div>
//                                     <div style={{ flex: 1, padding: '.5rem', borderRadius: '1rem', marginLeft: '2rem', display: 'flex' }}>
//                                         <div style={{ display: 'flex', flexWrap: 'wrap', width: '80%', paddingTop: '.5rem' }}>
//                                             <input type="text" value={text.title} style={{ fontSize: '1rem', outline: 'none', width: '100%', fontWeight: 600 }} />
//                                             <input type="text" value={text.description} style={{ outline: 'none', width: '100%' }} />
//                                         </div>
//                                         <div>22</div>
//                                     </div>
//                                 </div>
//                             })

//                         }
//                         <div style={{ width: '100%', height: '9vh', display: 'flex', position: 'relative' }}>
//                             <div style={{ width: '9%', paddingLeft: '1.2rem', color: '#999', paddingTop: '1.2rem', fontSize: '.8rem' }}>{`第${index+1}章`}</div>
//                             <div style={{ height: '150%', position: 'relative' }}>
//                                 <div style={{ border: '1px solid #ccc', width: '1px', height: '100%', }}></div>
//                                 <div style={{ width: '1.2vw', border: '1px solid #ccc', position: 'absolute', top: '30%' }}>

//                                 </div>
//                                 <span style={{ position: 'absolute', top: '23%', right: '-1.5rem', fontSize: '.6rem', color: '#ccc' }}>○</span>

//                                 <div style={{ position: 'absolute', left: '-.24rem', bottom: '-.5rem', fontSize: '1rem', color: '#ccc' }}>●</div>


//                             </div>
//                             <div style={{ flex: 1, padding: '.5rem', borderRadius: '1rem', marginLeft: '2rem', display: 'flex' }}>
//                                 <div style={{ display: 'flex', flexWrap: 'wrap', width: '80%', paddingTop: '.5rem' }}>
//                                     <input type="text" value={item.title} style={{ fontSize: '1rem', outline: 'none', width: '100%', fontWeight: 600 }} />
//                                     <input type="text" value={item.description} style={{ outline: 'none', width: '100%' }} />
//                                 </div>
//                                 <div>22</div>
//                             </div>
//                         </div>
//                     </>
//                 })
//             }
//         </>
//     )
// }

// export default content

// // components/Chapter.js
// // import React from 'react';

// // const Chapter = ({ title, description, subchapters }: any) => (
// //     <div style={{ marginBottom: '2rem' }}>
// //         <h5>{title}</h5>
// //         <p>{description}</p>
// //         {subchapters && (
// //             <ul style={{ listStyleType: 'none', paddingLeft: '1rem' }}>
// //                 {subchapters.map((subchapter: any, index: any) => (
// //                     <li key={index}>
// //                         <Chapter {...subchapter} />
// //                     </li>
// //                 ))}
// //             </ul>
// //         )}
// //     </div>
// // );

// // export default Chapter;

// 为了在中间插入章节或子章节，你需要明确插入的位置。你可以通过传递索引来指定插入的位置。下面是如何在中间插入章节或子章节的详细实现步骤。

// 更新 addChapter 函数
// 首先，定义一个函数 addChapter，接受索引参数，以便插入到指定位置：

import React, { useState } from 'react';

// 重新生成章节和子章节的序号
function reindexChapters(data:any) {
  data.chapters.forEach((chapter: { title: string; subchapters: any[]; }, chapterIndex: number) => {
    chapter.title = `第${chapterIndex + 1}章 ${chapter.title.split(' ').slice(1).join(' ')}`;
    chapter.subchapters.forEach((subchapter, subchapterIndex) => {
      subchapter.title = `${chapterIndex + 1}.${subchapterIndex + 1} ${subchapter.title.split(' ').slice(1).join(' ')}`;
    });
  });
  return data;
}

function addChapter(data: { chapters: any[]; }, chapterIndex: number, subChapterIndex: number | undefined) {
  const newChapter = {
    title: `新章节标题`,
    description: "新章节描述",
    subchapters: []
  };

  if (subChapterIndex !== undefined) {
    data.chapters[chapterIndex].subchapters.splice(subChapterIndex + 1, 0, newChapter);
  } else {
    data.chapters.splice(chapterIndex + 1, 0, newChapter);
  }

  return reindexChapters(data);
}

function editChapter(data: { chapters: any }, chapterIndex: any | number, subChapterIndex: any | number | undefined, newTitle: any, newDescription: any) {
  if (subChapterIndex !== undefined) {
    data.chapters[chapterIndex].subchapters[subChapterIndex].title = newTitle;
    data.chapters[chapterIndex].subchapters[subChapterIndex].description = newDescription;
  } else {
    data.chapters[chapterIndex].title = newTitle;
    data.chapters[chapterIndex].description = newDescription;
  }

  return reindexChapters(data);
}

function deleteChapter(data: { chapters: any[]; }, chapterIndex: any | number, subChapterIndex: undefined) {
  if (subChapterIndex !== undefined) {
    data.chapters[chapterIndex].subchapters.splice(subChapterIndex, 1);
  } else {
    data.chapters.splice(chapterIndex, 1);
  }

  return reindexChapters(data);
}

function promoteChapter(data: { chapters: any[]; }, chapterIndex: number, subChapterIndex: any) {
  const promotedChapter = data.chapters[chapterIndex].subchapters.splice(subChapterIndex, 1)[0];
  data.chapters.splice(chapterIndex + 1, 0, promotedChapter);

  return reindexChapters(data);
}

function demoteChapter(data: { chapters: any[]; }, chapterIndex: any, targetChapterIndex: any | number) {
  const demotedChapter = data.chapters.splice(chapterIndex, 1)[0];
  data.chapters[targetChapterIndex].subchapters.push(demotedChapter);

  return reindexChapters(data);
}

function Chapter({ chapter, chapterIndex, subChapterIndex, data, setData }:any) {
  const handleAddChapter = () => {
    const newData = addChapter(data, chapterIndex, subChapterIndex);
    setData(newData);
  };

  const handleEditChapter = (newTitle: string, newDescription: string) => {
    const newData = editChapter(data, chapterIndex, subChapterIndex, newTitle, newDescription);
    setData(newData);
  };

  const handleDeleteChapter = () => {
    const newData = deleteChapter(data, chapterIndex, subChapterIndex);
    setData(newData);
  };

  const handlePromoteChapter = () => {
    const newData = promoteChapter(data, chapterIndex, subChapterIndex);
    setData(newData);
  };

  const handleDemoteChapter = (targetChapterIndex: number) => {
    const newData = demoteChapter(data, chapterIndex, targetChapterIndex);
    setData(newData);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={chapter.title}
          onChange={(e) => handleEditChapter(e.target.value, chapter.description)}
          style={{ marginRight: '1rem' }}
        />
        <textarea
          value={chapter.description}
          onChange={(e) => handleEditChapter(chapter.title, e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <button onClick={handleAddChapter}>新增章节</button>
        <button onClick={handleDeleteChapter}>删除章节</button>
        {subChapterIndex !== undefined && <button onClick={handlePromoteChapter}>升章</button>}
        {subChapterIndex === undefined && chapterIndex > 0 && (
          <button onClick={() => handleDemoteChapter(chapterIndex - 1)}>降章节</button>
        )}
      </div>
      {chapter.subchapters && chapter.subchapters.length > 0 && (
        <ul style={{ marginLeft: '2rem' }}>
          {chapter.subchapters.map((subChapter: any, subChapterIndex: React.Key | null | undefined) => (
            <li key={subChapterIndex}>
              <Chapter
                chapter={subChapter}
                chapterIndex={chapterIndex}
                subChapterIndex={subChapterIndex}
                data={data}
                setData={setData}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IndexPage({ initialData}:any) {
 
  
  const [data, setData] = useState(initialData);

  return (
    <div>
      <div>
        <input type="text" value={data.title} readOnly />
      </div>
      {data.chapters.map((chapter: any, chapterIndex: any) => (
        <Chapter
          key={chapterIndex}
          chapter={chapter}
          chapterIndex={chapterIndex}
          data={data}
          setData={setData} subChapterIndex={undefined}        />
      ))}
    </div>
  );
}

export default IndexPage;



// reindexChapters: 在所有章节和子章节上重新生成序号，确保序号的连续性和有效性。
// addChapter: 新增章节后重新生成序号。
// editChapter: 编辑章节内容后重新生成序号。
// deleteChapter: 删除章节后重新生成序号。
// promoteChapter: 提升章节后重新生成序号。
// demoteChapter: 降级章节后重新生成序号