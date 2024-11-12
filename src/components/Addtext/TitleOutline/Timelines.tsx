"use client";
import { userSetOutline } from "@/api/longText";
import { UpdateOutlineTitle } from "@/api/outline";
import { useAppSelector } from "@/redux/storeIndex";
import { ExportOutlined, LoadingOutlined, MessageOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";
import { Tooltip, Dropdown, MenuProps, message } from "antd";
import { cloneDeep, debounce, throttle, difference, omit, update } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";

import Controls from '../../../../public/outline/Frame(2).png'
function Chapter({
  chapter,
  chapterIndex,
  subChapterIndex,
  data,
  setData,
  getLongContent,
  onAdd,
  onDelete,
  onUpgrade,
  onDowngrading,
  onChange,
  messageId
}: any) {
  const { id, parentIds = [] } = chapter || {};
  let { messageOutlineId, isAddHistory, addOutlineid } = useAppSelector(state => state.longReducer)
  let [showBack, setshowBack] = useState(false);
  let [showText, setshowText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  // 新增章节
  const handleAddChapter = () => {
    if (data.chapters && subChapterIndex !== undefined) {
      let descriptionObj = {
        title: "",
        description: "",
        subchapters: [],
      };
      // // 克隆当前的 chapters 数组
      const updatedChapters = [...data.chapters];
      if (updatedChapters[chapterIndex]) {
        updatedChapters[chapterIndex].subchapters =
          updatedChapters[chapterIndex].subchapters || [];
        updatedChapters[chapterIndex].subchapters.splice(
          subChapterIndex + 1,
          0,
          descriptionObj
        );
      }
      // // 在指定的章节中插入新的子章节对象
      // updatedChapters[chapterIndex ].subchapters?.splice(subChapterIndex + 1, 0, newObj);
      // 更新状态
      setData({
        ...data,
        chapters: updatedChapters,
      });


    } else {
      let chapterObj = {
        title: "",
        description: "",
        subchapters: [],
      };
      // 创建一个新的数据对象，不要直接修改原始数据
      let newData = {
        ...data,
        chapters: [
          ...data.chapters.slice(0, chapterIndex), // 插入位置之前的章节
          chapterObj, // 新章节
          ...data.chapters.slice(chapterIndex), // 插入位置之后的章节
        ],
      };
      // 更新状态`
      setData(newData);
    }
    getLongContent(data);
  };



  // 修改标题
  let handleEditTitle = (e: any) => {
    setChildrenBorder(false)
    const newValue = { title: e.target.value }
    onChange(chapterIndex, newValue)
  };
  // 修改描述
  let handleEditDescription = (e: any) => {
    setChildrenBorder(false)
    const newValue = { description: e.target.value }
    onChange(chapterIndex, newValue)

  };
  // console.log(data);
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <>
          {parentIds.length ? (
            <div onClick={() => onUpgrade(chapter, chapterIndex)}>升为章节</div>
          ) : (
            <div onClick={() => onDowngrading(chapter, chapterIndex)}>降章</div>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: <div onClick={() => onAdd(chapter, chapterIndex)}>新增</div>,
    },
    {
      key: "3",
      label: <div onClick={() => onDelete(chapter, chapterIndex)}>删除</div>,
    },
  ];


  const debouncedOnChange = throttle(async (data) => {
    // 在这里执行需要进行的操作，例如发送请求或者更新状态等
    // 更改大纲  messages_id: isAddHistory ? messageOutlineId : createDecordId
    userSetOutline({ messages_id: isAddHistory ? messageOutlineId : addOutlineid, content: data }).then((res) => {
      // console.log(res);
    }).catch((error) => {
      message.error(error)
    })

  }, 3000); // 设置防抖延迟时间为500毫秒

  useEffect(() => {
    debouncedOnChange(data)
  }, [data, setData])
  useEffect(() => {
    getLongContent(data)

  }, [data, setData,])
  let [childrenBorder, setChildrenBorder] = useState(false)
  // 点击上传文件
  let inputRef = useRef<HTMLInputElement>(null)
  let handleUpdate = () => {
    inputRef.current?.click()

  }
  let handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // access the first file selected
    if (file) {
      console.log('Selected file:', file);

    }
  }
  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "9vh",
          display: "flex",
          position: "relative",
        }}
      >

        <div
          style={{
            width: "9%",
            paddingLeft: "1.2rem",
            color: "#999",
            paddingTop: "1.2rem",
            fontSize: ".8vw",
            display: 'flex',
          }}
        >
          {!chapter.parentId ? (
            <div>{`第${id}章`}</div>
          ) : (
            <div style={{ textAlign: "center" }}>{`${chapter.id}`}</div>
          )}
        </div>
        <div style={{ height: "150%", position: "relative", marginLeft: '1vw' }}>
          <div
            style={{ border: "1px solid #ccc", width: "1px", height: "100%" }}
          ></div>
          {chapterIndex && !chapter.subchapters ? (
            // 横杠
            // <div
            //   style={{
            //     width: "1.2vw",
            //     border: "1px solid #ccc",
            //     position: "absolute",
            //     top: "30%",
            //   }}
            // ></div>
            <></>
          ) : (
            ""
          )}
          {chapterIndex && !chapter.subchapters ? (
            // 空心圆
            <></>
            // <span
            //   style={{
            //     position: "absolute",
            //     top: "24%",
            //     right: "-1.5rem",
            //     fontSize: ".6vw",
            //     color: "#ccc",
            //   }}
            // >
            //   ○
            // </span>
          ) : (
            ""
          )}
          {/* 实心圆 */}
          <div
            style={{
              position: "absolute",
              left: "-.24rem",
              bottom: "-.5rem",
              fontSize: "1vw",
              color: "#ccc",
            }}
          >
            ●
          </div>
        </div>
        {/* 中间展示标题与内容区域 */}

        <div
          onMouseEnter={() => {
            setshowBack(true);
            // setshowText(subchapters);
          }}
          onMouseLeave={() => {
            setshowBack(false);
          }}
          style={{

            flex: 1,
            padding: ".5rem",

            marginLeft: "2rem",
            display: "flex",

          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "80%",
              paddingTop: ".5rem",
              paddingLeft: '.5rem',
              borderRadius: ".5rem",

              background: showBack ? "#F1F6FF" : "",
              border: childrenBorder ? "1px solid blue" : '',
            }}
          >
            <input
              type="text"
              onFocus={() => { setChildrenBorder(true) }}
              onBlur={handleEditTitle}
              defaultValue={chapter.title ? chapter.title : "新增标题"}
              style={{
                background: "none",
                fontSize: "1vw",
                outline: "none",
                width: "100%",
                fontWeight: 600,
                marginTop: "-.5rem",
                border: 'none'
              }}
            />
            <input
              type="text"
              onFocus={() => { setChildrenBorder(true) }}

              onBlur={handleEditDescription}
              defaultValue={
                chapter.description ? chapter.description : "新增描述"
              }
              style={{
                border: 'none',
                background: "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "#666",
                fontSize: ".8vw",
                outline: "none",
                width: "100%",
                fontWeight: 400,
              }}
            />
            {/* 上传文件展示区域 */}
            {/* <div>222</div> */}
          </div>
          <>
            {showBack ? (
              <div
                style={{
                  width: "20%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {" "}
                  <Tooltip title={'上传文件'}>
                    <UploadOutlined onClick={handleUpdate} style={{ marginRight: "1rem" }} />

                  </Tooltip>
                  <input type="file" style={{ display: 'none' }} ref={inputRef} onChange={handleFileChange} />
                  <Dropdown menu={{ items }}>
                    <img src={Controls} width={15} height={15} alt="" style={{ cursor: 'pointer' }}></img>
                  </Dropdown>
                </div>

              </div>
            ) : (
              ""
            )}
          </>

        </div>

      </div>

      {contextHolder}

    </div>

  );
}

function IndexPage({ datas, getLongContent, messageId }: any) {

  const [data, setData] = useState(datas);
  let [titleIcon, setTitleIcon] = useState(false)

  /**
   * @method 获取随机字符串
   */
  const randomString = () => Math.random().toString(36).slice(2);

  /**
   * @description 将数据扁平化，添加关联关系
   */
  const flatData = useMemo(() => {
    if (!data?.chapters?.length) return [];

    const recursion = (data: any[], parentItem?: any) => {
      if (!data?.length) return [];

      let result: any[] = [];

      data.map((item, index) => {

        const id = index + 1;
        item.id = parentItem ? `${parentItem.id}.${id}` : `${id}`;
        item.uid = randomString();
        if (parentItem) {
          item.parentId = parentItem.id;
          item.parentIds = [...(parentItem.pids || []), parentItem.id];
        }
        result.push(item);
        if (item.subchapters?.length) {
          result = result.concat(recursion(item.subchapters, item));
        }
      });

      return result;
    };

    const result = recursion(cloneDeep(data.chapters));
    return result;
  }, [data]);

  /**
   * @method 扁平化数据转换为树结构
   */
  const flatDataToTree = (data: any) => {
    const map: any = {};
    const result: any[] = [];


    // 构建映射表
    data.forEach((item: any) => {
      item.subchapters = [];
      map[item.id] = item;
    });

    // 将子节点添加到父节点的 children 数组中
    data.forEach((item: any) => {
      const parent = map[item.parentId];
      // console.log(parent);

      const newItem = omit(item, ["id", "uid", "parentId", "parentIds"]);
      if (parent) {
        parent.subchapters.push(newItem);
      } else {
        result.push(newItem);
      }
    });
    console.log(result);
    return result;

  };

  /**
   * @method 执行新增章节
   */
  const onAdd = (record: Record<string, any>, index: number) => {
    const flatDataArr = cloneDeep(flatData);
    const { parentIds: parentIds = [], parentId } = record || {};

    let newIndex = -1;
    for (let i = index + 1; i < flatDataArr.length; i++) {
      const { parentIds: itemParentIds = [] } = flatDataArr[i];

      /**
       * @description 判断当前遍历项是否是父级节点 || 判断当前遍历项是否是兄弟节点
       */
      if (
        parentIds.length > itemParentIds.length ||
        (itemParentIds.length === parentIds.length &&
          !difference(parentIds, itemParentIds).length)
      ) {
        newIndex = i;
        break;
      }
    }

    newIndex = newIndex > -1 ? newIndex : flatDataArr.length;

    flatDataArr.splice(newIndex, 0, {
      title: "",
      description: "",
      id: randomString(),
      parentId,
      parentIds,
    });

    const treeData = flatDataToTree(flatDataArr);
    setData({ ...data, chapters: treeData });
  };

  /**
   * @method 执行删除章节
   */
  const onDelete = (record: Record<string, any>, index: number) => {
    const { parentIds: parentIds = [], id } = record || {};
    // 删除节点列表数据
    const removeRecords: any[] = [];
    // 新的节点列表数据
    const flatDataArr = cloneDeep(flatData);

    for (let i = index; i < flatDataArr.length; i++) {
      const item = flatDataArr[i] || {};
      const { parentIds: itemParentIds = [], id: itemId } = item;

      /**
       * @description 【遍历项】是当前点击节点 ||【遍历项】是当前点击子节点
       */
      if (
        itemId === id ||
        (itemParentIds.length > parentIds?.length && itemParentIds.includes(id))
      ) {
        removeRecords.push(item);
      } else {
        break;
      }
    }

    flatDataArr.splice(index, removeRecords.length);
    const treeData = flatDataToTree(flatDataArr);
    setData({ ...data, chapters: treeData });
  };

  /**
   * @method 执行升级章节
   */
  const onUpgrade = (record: Record<string, any>, index: number) => {
    const flatDataArr = cloneDeep(flatData);
    const { parentIds = [], parentId, id } = record || {};

    if (!parentIds.length) {
      console.log("已是顶级，不能再升级");
      return;
    }

    const parentItem = flatDataArr.find((item) => item.id === parentId);
    // 新的节点节点值
    const newRecords: any[] = [];

    for (let i = index; i < flatDataArr.length; i++) {
      const item = flatDataArr[i];
      const { parentIds: itemPids = [], id: itemId } = item || {};

      // 条件成立：【当前点击节点】比【遍历项】的级别低，则结束循环
      if (parentIds.length > itemPids.length) break;

      // 【遍历项】是当前点击节点
      if (itemId === id) {
        const newPids = itemPids.filter((pId: string) => pId !== parentId);
        newRecords.push({
          ...item,
          parentId: parentItem?.parentId,
          parentIds: newPids,
        });
        continue;
      } else if (itemPids.length > parentIds.length && itemPids.includes(id)) {
        // 【遍历项】是当前点击子节点
        const newPids = itemPids.filter((pId: string) => pId !== parentId);
        newRecords.push({ ...item, [itemPids]: newPids });
        continue;
      } else {
        const newPids = itemPids;
        const spliceIndex = itemPids.findIndex(
          (pId: string) => pId === parentId
        );
        // 兄弟节点
        if (parentIds.length == itemPids.length) {
          newPids.splice(spliceIndex, 1, id);
          newRecords.push({ ...item, parentId: id, parentIds: newPids });
        } else {
          // 兄弟后代节点，替换【点击节点父级id】为【当前节点id】
          newPids.splice(spliceIndex, 1, id);
          newRecords.push({ ...item, parentIds: newPids });
        }
      }
    }

    flatDataArr.splice(index, newRecords.length, ...newRecords);
    const treeData = flatDataToTree(flatDataArr);
    setData({ ...data, chapters: treeData });
  };
  /**
   * @method 执行降级章节
   */
  const onDowngrading = (record: Record<string, any>, index: number) => {
    const flatDataArr = cloneDeep(flatData);
    const prevRecord = flatDataArr[index - 1] || {};
    const { parentIds = [], id } = record || {};
    const {
      parentIds: prevParentIds = [],
      id: prevId,
      parentId: prevParentId,
    } = prevRecord;

    if (
      !Object.keys(prevRecord).length ||
      parentIds.length > prevParentIds.length
    ) {
      console.log("已是底级, 不能再降级！");
      return;
    }

    // 新的节点节点值
    const newRecords: any[] = [];
    for (let i = index; i < flatDataArr.length; i++) {
      const item = flatDataArr[i];
      const { parentIds: itemPids = [], id: itemId } = item || {};
      const parentPid =
        prevParentIds.length === parentIds.length ? prevId : prevParentId;
      // 【遍历项】是当前点击节点
      if (id === itemId) {
        newRecords.push({
          ...item,
          parentId: parentPid,
          parentIds: [parentPid],
        });
      } else if (itemPids.length > parentIds.length && itemPids.includes(id)) {
        // 【遍历项】是当前点击子节点
        newRecords.push({
          ...item,
          parentId: parentPid,
          parentIds: [parentPid],
        });
      } else {
        break;
      }
    }

    flatDataArr.splice(index, newRecords.length, ...newRecords);
    const treeData = flatDataToTree(flatDataArr);
    setData({ ...data, chapters: treeData });

  };

  /**
   * @method 修改章节信息
   */
  const onChange = (index: number, newValue: string) => {
    const flatDataArr = cloneDeep(flatData);
    Object.assign(flatDataArr[index], newValue);
    const treeData = flatDataToTree(flatDataArr);
    setData({ ...data, chapters: treeData });

  };
  // 更改标题
  let handleUpTitle = () => {
    setTitleIcon(true)
    UpdateOutlineTitle({ user_input: data.title }).then((result) => {
      if (result.data.status.code === 200) {
        setData((prev: any) => ({
          ...prev,
          title: result.data.title
        }));
        setTitleIcon(false)
      }
    }).catch((err) => {
      console.log(err);

    });
  }
  // 标题的背景颜色
  let [titleColor, setTitleColor] = useState(false)
  // 设置边框
  let [borders, setBorders] = useState(false)
  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "9vh",
          display: "flex",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "9%",
            paddingLeft: "1.2rem",
            color: "#999",
            paddingTop: "1.2rem",
            fontSize: ".8vw",
          }}
        >
          {data.title ? "标题" : "标题"}
        </div>
        <div style={{ height: "150%", position: "relative" }}>
          <div
            style={{ border: "1px solid #ccc", width: "1px", height: "100%", marginLeft: '1vw' }}
          ></div>
          <div
            style={{
              width: "1.2vw",
              border: "1px solid #ccc",
              position: "absolute",
              top: "30%",
              marginLeft: '1vw'

            }}
          ></div>
          {/* <span
            style={{
              position: "absolute",
              top: "23%",
              right: "-1.5rem",
              fontSize: ".6vw",
              color: "#ccc",
              marginLeft: '1vw'
            }}
          >
            ○
          </span> */}
          <div
            style={{
              position: "absolute",
              left: "-.24rem",
              bottom: "-.5rem",
              fontSize: "1vw",
              color: "#ccc",
              marginLeft: '1vw'
            }}
          >
            ●
          </div>
        </div>
        <div
          onMouseEnter={() => {
            setTitleColor(true);
            // setshowText(subchapters);
          }}
          onMouseLeave={() => {
            setTitleColor(false);
          }}

          style={{
            flex: 1,
            padding: ".5rem",

            marginLeft: "2rem",
            display: "flex",
            alignItems: 'center',


          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              borderRadius: ".5rem",
              width: "80%",
              padding: '.5rem',
              paddingTop: ".5rem",
              background: titleColor ? '#F1F6FF' : '',
              border: borders ? '1px blue solid' : '',
            }}
          >
            <input
              type="text"
              value={data.title}
              defaultValue={data.title}
              onChange={(e) => {
                setData((prev: any) => ({
                  ...prev,
                  title: e.target.value
                }));
              }}
              onFocus={() => { setBorders(true) }}
              onBlur={() => { setBorders(false) }}
              style={{
                fontSize: "1vw",
                outline: "none",
                width: "100%",
                fontWeight: 600,
                background: 'none',
                border: 'none'
              }}
            />
          </div>
          <div style={{ cursor: 'pointer', fontSize: '.8vw' }} onClick={handleUpTitle}>
            {
              titleIcon ? <LoadingOutlined style={{ margin: '0 1vh' }} /> : <SyncOutlined style={{ margin: '0 1vh' }} />
            }


            AI更换标题
          </div>
        </div>
      </div>

      {flatData.map((chapter: any, chapterIndex: any) => {
        return (
          <Chapter
            key={chapter.uid}
            chapter={chapter}
            chapterIndex={chapterIndex}
            data={data}
            setData={setData}
            subChapterIndex={undefined}
            getLongContent={getLongContent}
            messageId={messageId}
            onAdd={onAdd}
            onDelete={onDelete}
            onUpgrade={onUpgrade}
            onDowngrading={onDowngrading}
            onChange={onChange}
          />
        );
        // <Chapter key={index} {...chapter} index={index + 1}  />
      })}
    </div>
  );
}

export default IndexPage;
