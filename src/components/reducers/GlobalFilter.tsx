import React from "react";
import { GlobalFilterProps } from "cdm/MenuBarModel";
import {
  DebouncedInputWrapper,
  Search,
  SearchIconWrapper,
} from "components/styles/NavBarStyles";
import DebouncedInput from "components/behavior/DebouncedInputFn";

/**
 * Filter component based on react-table.
 * used to filter the data based on the search text.
 * @param globalFilterProps
 * @returns
 */
export default function GlobalFilter(globalFilterProps: GlobalFilterProps) {
  const { hits, globalFilter, setGlobalFilter } = globalFilterProps;

  return (
    <Search>
      <SearchIconWrapper>{hits}</SearchIconWrapper>
      <DebouncedInputWrapper>
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search...`}
        />
      </DebouncedInputWrapper>
    </Search>
  );
}
