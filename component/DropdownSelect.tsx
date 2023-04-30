import { useState, useEffect } from "react";

interface Props {
    bindLabel: string,
    dataSet: [],
    selected?: [],
    onChange: any,
    placeholder: string,
    noItemText: string,
    id?:string,
    display?:boolean,
}
export function DropdownSelect(
    { dataSet, bindLabel, onChange, placeholder, noItemText, selected, id, display }: Props) {
    const [query, setQuery] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<[]>(selected || []);
    const [optionItems, setOptionItems] = useState<[]>(
    dataSet.filter(item => {
        return !selected?.some(selectedItem => JSON.stringify(selectedItem) === JSON.stringify(item))
    })
    );
    const [showOptions, setShowOptions] = useState<boolean>(display);

    function handleFilter(data: any, query: string) {
        const newQuery = query.toLowerCase();
        return data.filter((item) => item[bindLabel].toLowerCase().includes(newQuery));
    }

    function handleRemoveItem(state: any, dataSet: [], item: any) {
        const newDateSet = dataSet.filter((existing: any) => existing !== item);
        const sorted = newDateSet.sort((a: any, b: any) => a.id - b.id);
        const newOptionItems: any = [...optionItems, item].sort((a: any, b: any) => a.id - b.id)
        setOptionItems(newOptionItems)
        state(sorted);
        onChange(sorted);
    }

    function handleSelectItem(state: any, dataSet: [], item: any) {
        const selected = [...dataSet, item].sort((a: any, b: any) => a.id - b.id)
        const newOptionItems: any = optionItems.filter(existing => existing !== item).sort((a: any, b: any) => a.id - b.id);
        setOptionItems(newOptionItems);
        state(selected);
        onChange(selected);
    }

    useEffect(() => {
        onChange(selectedItems)
    }, [dataSet, onChange, selected, selectedItems])
    return (
        <div className="select-container" id={id}>
            <div className="selected-items">
                {
                    selectedItems?.map((item: any, index: number) =>
                        <div key={index} className="selected-item">
                            <h6 className="label">
                                {item[bindLabel]}
                            </h6>
                            <button
                                className="remove-btn"
                                onClick={() => {
                                    handleRemoveItem(setSelectedItems, selectedItems, item);
                                }}
                            >
                                <span
                                    className="remove-icon"
                                ></span>
                            </button>
                        </div>
                    )
                }
            </div>
            <div className="items-list-container">
                <div className="form-goup">
                    <input
                        placeholder={placeholder}
                        type="text"
                        className="input-filter"
                        onChange={(event) => setQuery(event.target.value)}
                        onClick={() => setShowOptions(true)}
                    />
                    <button
                        className="dropdown-btn"
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <div className="dropdown"></div>
                    </button>
                </div>
                <div
                    className={`items-list ${showOptions && 'd-flex'}`}
                >
                    {
                        handleFilter(optionItems, query)?.length > 0 ?
                            <>
                                {
                                    handleFilter(optionItems, query).map((item: any, index: number) =>
                                        <button
                                            key={index}
                                            type="button"
                                            className="label"
                                            onClick={() => {
                                                handleSelectItem(setSelectedItems, selectedItems, item);
                                            }}
                                        >
                                            {item[bindLabel]}
                                        </button>
                                    )
                                }
                            </> :
                            <h6 className="not-item-found">{noItemText}</h6>
                    }
                </div>
            </div>
        </div>
    )
}