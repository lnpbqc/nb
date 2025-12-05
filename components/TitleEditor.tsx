type Props = {
    value:string;
    onChange:(value:string) => void;
}

export default function TitleEditor({value,onChange}: Props){
    return (
        <div>
            {value}
        </div>
    )
}