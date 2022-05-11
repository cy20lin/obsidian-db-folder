import { ActionTypes, DataTypes } from "helpers/Constants";
import React, { useLayoutEffect, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { LOGGER } from "services/Logger";
import { Cell } from "react-table";
import { MarkdownRenderer } from "obsidian";
import NoteInfo from "services/NoteInfo";
import PopperSelectPortal from "components/portals/PopperSelectPortal";
import { CellContext } from "components/contexts/CellContext";
import { c } from "helpers/StylesHelper";

/**
 * Obtain the path of the file inside cellValue
 * i.e. if cellValue is "[[path/to/file.md|File Name]]" then return "path/to/file.md"
 * i.e. if cellValue is "[[path/to/file.md]]" then return "path/to/file.md"
 * i.e. if cellValue is "[[file.md]]" then return "file.md"
 * @param cellValue
 */
function getFilePath(cellValue: string): string {
  const regex = /\[\[(.*)\]\]/;
  const matches = regex.exec(cellValue);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return "";
}

export default function DefaultCell(cellProperties: Cell) {
  const dataDispatch = (cellProperties as any).dataDispatch;
  /** Initial state of cell */
  const initialValue = cellProperties.value;
  /** Columns information */
  const columns = (cellProperties as any).columns;
  /** Type of cell */
  const dataType = (cellProperties.column as any).dataType;
  /** Note info of current Cell */
  const note: NoteInfo = (cellProperties.row.original as any).note;
  /** state of cell value */
  const [value, setValue] = useState({ value: initialValue, update: false });
  /** state for keeping the timeout to trigger the editior */
  const [editNoteTimeout, setEditNoteTimeout] = useState(null);
  /** states for selector option  */
  LOGGER.debug(
    `<=> Cell.rendering dataType: ${dataType}. value: ${value.value}`
  );

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };
  // onChange handler
  const handleOnChange = (event: ContentEditableEvent) => {
    // cancelling previous timeouts
    if (editNoteTimeout) {
      clearTimeout(editNoteTimeout);
    }
    // first update the input text as user type
    setValue({ value: event.target.value, update: false });
    // initialize a setimeout by wrapping in our editNoteTimeout so that we can clear it out using clearTimeout
    setEditNoteTimeout(
      setTimeout(() => {
        onChange(event.target.value);
        // timeout until event is triggered after user has stopped typing
      }, 1500)
    );
  };

  function onChange(changedValue: string) {
    // save on disk
    dataDispatch({
      type: ActionTypes.UPDATE_CELL,
      file: note.getFile(),
      key: (cellProperties.column as any).key,
      value: changedValue,
      row: cellProperties.row,
      columnId: (cellProperties.column as any).id,
    });
  }

  function getCellElement() {
    switch (dataType) {
      /** Plain text option */
      case DataTypes.TEXT:
        return (cellProperties.column as any).isMetadata ? (
          <span className="data-input">{value.value.toString()}</span>
        ) : (
          <ContentEditable
            html={(value.value && value.value.toString()) || ""}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            onBlur={() =>
              setValue((old) => ({ value: old.value, update: true }))
            }
            className="data-input"
          />
        );
      /** Number option */
      case DataTypes.NUMBER:
        return (
          <ContentEditable
            html={(value.value && value.value.toString()) || ""}
            onChange={handleOnChange}
            onBlur={() =>
              setValue((old) => ({ value: old.value, update: true }))
            }
            className="data-input text-align-right"
          />
        );
      /** Markdown option */
      case DataTypes.MARKDOWN:
        const containerRef = useRef<HTMLElement>();
        useLayoutEffect(() => {
          //TODO - this is a hack. find why is layout effect called twice
          containerRef.current.innerHTML = "";
          MarkdownRenderer.renderMarkdown(
            initialValue,
            containerRef.current,
            getFilePath(initialValue),
            null
          );
        });

        return <span ref={containerRef} className={`${c("md_cell")}`}></span>;
      /** Selector option */
      case DataTypes.SELECT:
        return (
          <CellContext.Provider value={{ value, setValue }}>
            <PopperSelectPortal
              dispatch={dataDispatch}
              row={cellProperties.row}
              column={cellProperties.column}
              columns={columns}
              note={note}
              state={(cellProperties as any).initialState}
            />
          </CellContext.Provider>
        );

      /** Default option */
      default:
        LOGGER.warn(`Unknown data type: ${dataType}`);
        return <span></span>;
    }
  }
  return getCellElement();
}
