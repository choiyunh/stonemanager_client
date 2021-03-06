import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {v4 as uuid} from "uuid";
import { Row } from 'react-bootstrap';
import {
    Link, BrowserRouter, Route,
} from 'react-router-dom';
import {TaskDetail} from './taskDetail';


const columnsFromBackend = {
  [uuid()]: {
    name: "TO DO",
    items: [
      { id: uuid(), content: "최종 발표", manager: "최고운 박종근", taskDate: "2020.12.05", tagName: "class", tagColor: "lightgreen" },
      { id: uuid(), content: "최종보고서 작성", manager: "최고운 김영훈", taskDate: "2020.12.07", tagName: "class", tagColor: "lightgreen" }
    ]
  },
  [uuid()]: {
    name: "In Progress",
    items: [{ id: uuid(), content: "코딩", manager: "김영훈 최윤호", taskDate: "2020.12.03", tagName: "develop", tagColor: "lightblue" }]
  },
  [uuid()]: {
    name: "Completed",
    items: [ { id: uuid(), content: "클래스 다이어그램", manager: "최고운 최윤호", taskDate: "2020.11.01", tagName: "class", tagColor: "lightgreen"},
    { id: uuid(), content: "시퀀스 다이어그램", manager: "박종근 김영훈", taskDate: "2020.11.13", tagName: "class", tagColor: "lightgreen"},
    { id: uuid(), content: "UI/UX 제작", manager: "최고운 최윤호", taskDate: "2020.11.30", tagName: "design", tagColor: "lightpink"}]
  },
  [uuid()]: {
    name: "Pending",
    items: [{ id: uuid(), content: "테스팅", manager: "박종근", taskDate: "2020.12.02", tagName: "develop", tagColor: "lightblue" }]
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

function TaskBoard() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div className="TaskBoard" 
    style={{ display: "flex", justifyContent: "center", height: "100%", marginTop:100, marginLeft:100}}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 20 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#7ebaff"
                            : "#ececec",
                          padding: 20,
                          width: 250,
                          minHeight: 500
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Link to="/taskDetail">
                                <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                                >
                                {(provided, snapshot) => {
                                    return (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "16px 16px 16px 16px",
                                        minHeight: "100px",
                                        backgroundColor: snapshot.isDragging
                                            ? "#1a83ff"
                                            : "#fafafa",
                                        color: "black",
                                        ...provided.draggableProps.style
                                        }}
                                    >
                                        <Row style={{fontSize:20}}>
                                            {item.content}
                                        </Row>
                                        <Row style={{fontSize:12}}>
                                            {item.manager}
                                        </Row> 
                                        <Row style={{fontSize:12}}>
                                            {item.taskDate}
                                        </Row>  
                                        <Row style={{fontSize:12, backgroundColor: item.tagColor}}>
                                            {item.tagName}
                                        </Row>                                 
                                    </div>
                                    );
                                }}
                                </Draggable>
                            </Link>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
      <BrowserRouter>
        <Route path="/taskDetail" component={TaskDetail}/>
      </BrowserRouter>
    </div>
    
  );
}

export default TaskBoard;