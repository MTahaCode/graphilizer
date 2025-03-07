import React, { useRef, useState } from 'react'

interface props {
    state: any;
    setter: (value: any) => void;
}

const EditableCell: React.FC<props> = ({state, setter}) => {

    const [editable, setEditable] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const editModeOn = () => setEditable(true);
    const editModeOff = () => setEditable(false);
    const saveEdit = () => {
        editModeOff();
        if (inputRef.current) {
            setter(inputRef.current.value);
        }
        else {
            setter(0);
        }
    };

    const EnterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            saveEdit();
        }
    }

    return (
        <div onDoubleClick={editModeOn}>
            { editable ? (
                <input 
                    type="text" 
                    autoFocus
                    ref={inputRef}
                    defaultValue={state} 
                    onBlur={saveEdit}
                    onKeyDown={EnterPressed}
                />
            ) : (
                state
            )}
        </div>
    )
}

export default EditableCell;
